<script setup lang="ts">
import { ref } from 'vue'
import { CLIENT } from '../../utils/client'
import InputWithLabel from '../baseComponents/InputWithLabel.vue'
import db from '../../utils/db'
import Indicator from './Indicator.vue'
import { LoginStatus, LoginUtil } from './util'

const loginUtil = LoginUtil.SINGLETON
const loginStatus = ref(loginUtil.status)

loginUtil.onStatusChange = (status) => {
  loginStatus.value = status
  if (status === LoginStatus.FINISHED)
    db.put('ta-index', CLIENT.session.save(), 'session')
}

function handleSubmit(password: string) {
  loginUtil.loginWith2FactorPassword(password)
}

loginUtil.loginWithQRCode()
</script>

<template>
  <div
    w-100
    mx-auto
    rounded-md
    shadow-md
    p-4
  >
    <Indicator
      :done="loginStatus !== LoginStatus.QR_CODE_WAITING"
      text="Login by QR Code"
      note="Go To Settings > Devices > Link Desktop Device"
    >
      <div id="qr-code" />
    </Indicator>
    <Indicator
      v-if="loginStatus !== LoginStatus.QR_CODE_WAITING"
      :done="loginStatus !== LoginStatus.TWO_FACTOR_PASSWORD"
      text="Enter Password"
      note="You have Two-Step Verification enabled, so your account is protected with an additional password."
    >
      <InputWithLabel
        mx-auto
        block
        w-50 h-8
        label="Password"
        type="password"
        @submit="handleSubmit"
      />
    </Indicator>
  </div>
</template>
