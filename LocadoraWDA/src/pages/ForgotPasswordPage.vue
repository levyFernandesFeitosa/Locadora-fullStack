<template>
  <q-page class="forgot-password-layout flex flex-center q-pa-md">
    <div class="language-selector-container">
      <q-btn 
        round 
        flat 
        icon="language" 
        @click="langMenuVisible = !langMenuVisible" 
        :color="langMenuVisible ? 'primary' : 'grey-8'"
        size="md"
        class="q-pa-sm"
      />
      <div v-if="langMenuVisible" class="language-menu shadow-5">
        <q-list dense>
          <q-item
            v-for="lang in languages"
            :key="lang.code"
            clickable
            @click="changeLanguage(lang.code)"
            :active="locale === lang.code"
            active-class="bg-blue-1"
          >
            <q-item-section avatar>
              <div :class="lang.icon" style="width: 25px; height: 18px; background-size: contain; background-repeat: no-repeat;"></div>
            </q-item-section>
            <q-item-section>
              {{ lang.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

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
            <div class="text3" v-if="step === 1">{{ t('forgot_instruction') }}</div>
            <div class="text3" v-else>{{ t('ForgotPassword_success_message') }}</div>
          </q-card-section>
          
          <q-form class="campos q-gutter-md q-px-lg" @submit.prevent="handleSubmit">
            <!-- Passo 1: E-mail -->
            <q-input 
              v-if="step === 1"
              filled 
              v-model="email" 
              :label="t('ForgotPassword_email_label')" 
              outlined 
              type="email" 
              required 
              :disable="loading"
              class="full-width"
            />

            <!-- Passo 2: Novas Senhas -->
            <div v-if="step === 2" class="full-width q-gutter-y-md">
              <q-input 
                filled 
                v-model="password" 
                :label="t('ForgotPassword_new_password_label')" 
                outlined 
                type="password" 
                required 
                :disable="loading"
                class="full-width"
              />
              <q-input 
                filled 
                v-model="confirmPassword" 
                :label="t('ForgotPassword_confirm_password_label')" 
                outlined 
                type="password" 
                required 
                :disable="loading"
                class="full-width"
              />
            </div>

            <q-btn 
              v-if="step === 1"
              :label="t('ForgotPassword_button_send')" 
              type="submit" 
              color="primary" 
              :loading="loading"
              class="full-width"
              style="height: 50px;"
            />

            <q-btn 
              v-if="step === 2"
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
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import authService from 'src/services/authService.js' 
import logo from 'src/assets/image.png' 
import { useI18n } from 'vue-i18n' 

const router = useRouter()
const $q = useQuasar()
const { t, locale } = useI18n({ useScope: 'global' })

const step = ref(1)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const langMenuVisible = ref(false)

const languages = [
  { code: 'pt-BR', name: 'Português', icon: 'flag-icon flag-icon-br' }, 
  { code: 'en-US', name: 'English (US)', icon: 'flag-icon flag-icon-us' }, 
  { code: 'es', name: 'Español', icon: 'flag-icon flag-icon-es' },
  { code: 'fr', name: 'Français', icon: 'flag-icon flag-icon-fr' },
]

const changeLanguage = (langCode) => {
  locale.value = langCode
  localStorage.setItem('user-language', langCode)
  langMenuVisible.value = false
}

const handleSubmit = async () => {
  if (step.value === 1) {
    await handleVerifyEmail()
  } else {
    await handleResetPassword()
  }
}

const handleVerifyEmail = async () => {
  if (!email.value) return
  
  loading.value = true
  try {
    await authService.forgotPassword(email.value)
    $q.notify({
      type: 'positive',
      message: t('ForgotPassword_success_message'),
      position: 'top',
      timeout: 3000
    })
    step.value = 2
  } catch (err) {
    let msg = t('ForgotPassword_error_default')
    if (err.response?.status === 404) {
      msg = t('ForgotPassword_error_not_found')
    }
    $q.notify({
      type: 'negative',
      message: msg,
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

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
      message: t('ForgotPassword_reset_success'),
      position: 'top',
      timeout: 3000
    })
    
    // Pequeno delay antes de voltar ao login
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 2000)
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

// Segurança: limpa dados sensíveis ao sair da página
onUnmounted(() => {
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
})
</script>
