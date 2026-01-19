<template>
  <q-page class="forgot-password-layout flex flex-center q-pa-md">
    <q-card class="row q-card-login-responsive" style="border-radius: 3vh;">
      <div class="containerLeft col-md-5 hidden-sm hidden-xs" style="border-radius: 3vh;">
        <div class="flex">
          <div class="contentLeft"> 
            <div class="logoWDA"><img :src="logo" alt="Logo WDA" /></div>
            <div class="text1">{{ t('login_welcome_to') }}</div>
            <div class="text2">{{ t('login_app_name') }}</div>
          </div>
        </div>
      </div>
      
      <div class="containerRight col-xs-12 col-sm-12 col-md-7">
        <q-card flat class="full-width" >
          <q-card-section>
            <div class="text3">{{ t('ForgotPassword_title') }}</div>
            <div class="text3">{{ t('ForgotPassword_user_found') }}</div>
          </q-card-section>
          
          <q-form class="campos q-gutter-md q-px-lg" @submit.prevent="handleResetPassword">
            <q-input 
              filled 
              v-model="password" 
              :label="t('ForgotPassword_new_password_label')" 
              outlined 
              :type="passwordVisible ? 'text' : 'password'" 
              required 
              :disable="loading"
              class="full-width"
            >
              <template v-slot:append>
                <q-icon 
                  :name="passwordVisible ? 'visibility' : 'visibility_off'" 
                  class="cursor-pointer" 
                  @click="passwordVisible = !passwordVisible"
                />
              </template>
            </q-input>

            <q-input 
              filled 
              v-model="confirmPassword" 
              :label="t('ForgotPassword_confirm_password_label')" 
              outlined 
              :type="confirmPasswordVisible ? 'text' : 'password'" 
              required 
              :disable="loading"
              class="full-width"
            >
              <template v-slot:append>
                <q-icon 
                  :name="confirmPasswordVisible ? 'visibility' : 'visibility_off'" 
                  class="cursor-pointer" 
                  @click="confirmPasswordVisible = !confirmPasswordVisible"
                />
              </template>
            </q-input>

            <q-btn 
              :label="t('ForgotPassword_button_save')" 
              type="submit" 
              color="primary" 
              :loading="loading"
              class="full-width"
              style="height: 50px;"
            />

            <q-btn 
              flat 
              style="width: 100%;"
              color="primary" 
              :label="t('ForgotPassword_back_to_login')" 
              @click="router.push({ name: 'login' })" 
              :disable="loading"
            />
          </q-form>
        </q-card>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import authService from 'src/services/authService.js' 
import logo from 'src/assets/image.png' 
import { useI18n } from 'vue-i18n' 

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const { t } = useI18n({ useScope: 'global' })

const email = ref(route.query.email || '')
const password = ref('')
const confirmPassword = ref('')
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)
const loading = ref(false)

onMounted(() => {
  if (!email.value) {
    $q.notify({
      type: 'negative',
      message: t('ForgotPassword_error_default'),
      position: 'top'
    })
    router.push({ name: 'forgot-password' })
    return
  }

  $q.notify({
    type: 'positive',
    message: t('ForgotPassword_user_found'),
    position: 'top',
    timeout: 4000
  })
})

const handleResetPassword = async () => {
  if (!password.value || !confirmPassword.value) return
  
  if (password.value !== confirmPassword.value) {
    $q.notify({
      type: 'negative',
      message: t('ForgotPassword_password_mismatch'),
      position: 'top'
    })
    return
  }

  loading.value = true
  try {
    await authService.resetPassword(email.value, password.value)
    $q.notify({
      type: 'positive',
      message: t('ForgotPassword_reset_success_login'),
      position: 'top',
      timeout: 3000
    })
    
    router.push({ name: 'login' })
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: t('ForgotPassword_error_default'),
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  password.value = ''
  confirmPassword.value = ''
})
</script>
