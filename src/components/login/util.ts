import QRCodeStyling from 'qr-code-styling'
import { Api } from 'telegram'
import { computeCheck } from 'telegram/Password'
import { RPCError } from 'telegram/errors'
import { CLIENT } from '@/utils/client'
import db, { StoreNames } from '@/utils/db'

enum LoginStatus {
  QR_CODE_WAITING = 'qrCodeWaiting',
  QR_CODE_SCANNED = 'qrCodeScanned',
  TWO_FACTOR_PASSWORD = '2FactorPassword',
  FINISHED = 'finished',
}

class LoginUtil {
  status: LoginStatus = LoginStatus.QR_CODE_WAITING
  onStatusChange: (status: LoginStatus) => void = () => { }
  private token: string = ''
  private tokenExpire: number = 0

  static SINGLETON: LoginUtil = new LoginUtil()

  constructor() {
    db.get(StoreNames.GENERAL_SETTINGS, 'session')
      .then((session) => {
        if (session)
          this.status = LoginStatus.FINISHED
        this.onStatusChange(this.status)
      })
  }

  async loginWithQRCode() {
    if (this.status === LoginStatus.FINISHED) {
      this.onStatusChange(this.status)
      return
    }
    this.status = LoginStatus.QR_CODE_WAITING
    this.onStatusChange(this.status)
    const qrCodeScanned = new Promise((resolve) => {
      CLIENT.addEventHandler((update: Api.TypeUpdate) => {
        if (update instanceof Api.UpdateLoginToken) {
          this.status = LoginStatus.QR_CODE_SCANNED
          resolve(null)
        }
      })
    })

    // TODO: error handling from `getLoginToken`
    await Promise.race([qrCodeScanned, this.refreshQRCode()])
    try {
      const user = await this.getLoginToken()
      if (!user)
        throw new Error('login failed: unknown error')
    }
    catch (e) {
      if (e instanceof RPCError && e.errorMessage === 'SESSION_PASSWORD_NEEDED') {
        this.status = LoginStatus.TWO_FACTOR_PASSWORD
        this.onStatusChange(this.status)
      }
      else { throw e }
    }
  }

  /**
   * login with password
   * @param password The password user input
   * @returns user info
   */
  async loginWith2FactorPassword(password: string) {
    this.status = LoginStatus.TWO_FACTOR_PASSWORD
    const currectPasswordResult = await CLIENT.invoke(new Api.account.GetPassword())
    if (password.length === 0)
      throw new Error('Password cannot be empty')
    const passwordCheck = await computeCheck(currectPasswordResult, password)
    await CLIENT.invoke(new Api.auth.CheckPassword({ password: passwordCheck }))
    this.status = LoginStatus.FINISHED
    this.onStatusChange(this.status)
  }

  /**
   * refresh QR code every 30 seconds
   */
  async refreshQRCode() {
    while (this.status === LoginStatus.QR_CODE_WAITING) {
      await this.getLoginToken()
      const dom = document.getElementById('qr-code')
      if (dom)
        generateQRCode(`tg://login?token=${this.token}`, dom)
      await new Promise(resolve => setTimeout(resolve, this.tokenExpire * 1000 - Date.now()))
    }
  }

  /**
   * get login token
   * @returns user info or undefined(if login with QR code)
   */
  async getLoginToken(): Promise<Api.TypeUser | undefined> {
    // Generate a login token, for login via QR code.
    // The generated login token should be encoded using base64url, then shown as a tg://login?token=base64encodedtoken URL in the QR code.
    const result = await CLIENT.invoke(new Api.auth.ExportLoginToken({
      apiId: CLIENT.apiId,
      apiHash: CLIENT.apiHash,
      exceptIds: [],
    }))

    const qrCodeWaiting = this.status === LoginStatus.QR_CODE_WAITING
    const qrCodeScanned = this.status === LoginStatus.QR_CODE_SCANNED

    // login token for QR code login
    if (qrCodeWaiting && result instanceof Api.auth.LoginToken) {
      const encodedToken = result.token.toString('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '') // TODO: unknown usage
      this.token = encodedToken
      this.tokenExpire = result.expires
      return undefined
    }
    // DC mismatch
    else if (result instanceof Api.auth.LoginTokenMigrateTo) {
      await CLIENT._switchDC(result.dcId)
      const migrateResult = await CLIENT.invoke(new Api.auth.ImportLoginToken({ token: result.token }))
      if (qrCodeScanned && migrateResult instanceof Api.auth.LoginTokenSuccess && migrateResult.authorization instanceof Api.auth.Authorization) {
        this.status = LoginStatus.FINISHED
        this.onStatusChange(this.status)
        return migrateResult.authorization.user
      }
      else { throw new Error('(migrate) getLoginToken failed') }
    }
    // login success
    else if (qrCodeScanned && result instanceof Api.auth.LoginTokenSuccess && result.authorization instanceof Api.auth.Authorization) {
      this.status = LoginStatus.FINISHED
      this.onStatusChange(this.status)
      return result.authorization.user
    }
    else {
      console.error(result, this.status)
      throw new Error('getLoginToken failed')
    }
  }
}

/**
 * generate QR code with login token url
 * @param data login token url
 * @param dom dom element to render qr code
 */
function generateQRCode(data: string, dom: HTMLElement) {
  const qrCode = new QRCodeStyling({
    data,
    type: 'svg',
    width: 256,
    height: 256,
    qrOptions: { errorCorrectionLevel: 'M' },
    dotsOptions: { type: 'rounded' },
    cornersSquareOptions: { type: 'extra-rounded' },
    cornersDotOptions: { type: 'dot' },
  })

  while (dom.firstChild)
    dom.removeChild(dom.firstChild)

  qrCode.append(dom)
}

export { LoginUtil, LoginStatus }
