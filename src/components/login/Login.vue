<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { CLIENT } from '../../utils/client'
import InputWithLabel from '../baseComponents/InputWithLabel.vue'
import db from '../../utils/db'
import Indicator from './Indicator.vue'
import QRCodeSkeleton from './QRCodeSkeleton.vue'
import { LoginStatus, LoginUtil } from './util'

const router = useRouter()
const loginUtil = LoginUtil.SINGLETON
const loginStatus = ref(loginUtil.status)
const render2FactorPassword = ref(false)

watch(loginStatus, (status) => {
  if (status === LoginStatus.TWO_FACTOR_PASSWORD) {
    setTimeout(() => {
      render2FactorPassword.value = true
    }, 300)
  }
})

loginUtil.onStatusChange = (status) => {
  loginStatus.value = status
  if (status === LoginStatus.FINISHED) {
    db.put('ta-index', CLIENT.session.save(), 'session')
    router.push('/')
  }
}

function handleSubmit(password: string) {
  loginUtil.loginWith2FactorPassword(password)
}

onMounted(() => {
  loginUtil.loginWithQRCode()
})
</script>

<template>
  <div
    top="50%" left="50%"
    translate-x="-50%" translate-y="-50%"
    absolute w-100 overflow-hidden rounded-md p-4 text-center
  >
    <Indicator
      :done="loginStatus !== LoginStatus.QR_CODE_WAITING"
      text="Login by QR Code"
      note="Go To Settings > Devices > Link Desktop Device"
    >
      <div id="qr-code">
        <QRCodeSkeleton />
      </div>
    </Indicator>
    <Indicator
      v-if="render2FactorPassword"
      :done="loginStatus !== LoginStatus.TWO_FACTOR_PASSWORD"
      text="Enter Password"
      note="You have Two-Step Verification enabled, so your account is protected with an additional password."
    >
      <InputWithLabel
        mx-auto block h-8 w-50
        label="Password"
        type="password"
        @submit="handleSubmit"
      />
    </Indicator>
  </div>
</template>
