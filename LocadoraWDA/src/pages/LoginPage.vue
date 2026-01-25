<template>
  <q-page class="flex flex-center q-pa-md" style="height: 100vh; background-color: #edead0;">
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
            <div class="text1">{{ welcomeText }}</div>
            <div class="text2">{{ appName }}</div>
          </div>
        </div>
      </div>
      
      <div class="containerRight col-xs-12 col-sm-12 col-md-7">
        <q-card flat class="full-width" >
          <q-card-section>
            <div class="text3">{{ makeLogin }}</div>
            <div class="text4">{{ happyToSeeYou }}</div>
          </q-card-section>
          
          <q-form class="campos" @submit.prevent="handleLogin">
            <q-input 
              filled 
              v-model="email" 
              :label="emailLabel" 
              outlined 
              type="email" 
              required 
              :disable="loading"
            />
            <q-input 
              filled 
              v-model="password" 
              :label="passwordLabel" 
              type="password" 
              required 
              :disable="loading"
            />
            <q-btn 
              style="width: 100%;"
              flat
              color="blue" 
              :label="t('login_forgot_password')" 
              @click="router.push({ name: 'forgot-password' })"
              :disable="loading"
            />
            <q-btn 
              :label="enterButton" 
              type="submit" 
              color="primary" 
              :loading="loading"
            />

            
          </q-form>
        </q-card>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue' // Added computed
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import authService from 'src/services/authService.js' 
import logo from 'src/assets/image.png' 
import { useI18n } from 'vue-i18n' 

export default {
  name: 'LoginPage', 
  setup() {
    const router = useRouter()
    const $q = useQuasar()

    const { t, locale, messages } = useI18n({ useScope: 'global' }) // Added messages

    const welcomeText = computed(() => t('login_welcome_to'))
    const appName = computed(() => t('login_app_name'))
    const makeLogin = computed(() => t('login_make_your_login'))
    const happyToSeeYou = computed(() => t('login_happy_to_see_you_again'))
    const emailLabel = computed(() => t('login_email_label'))
    const passwordLabel = computed(() => t('login_password_label'))
    const enterButton = computed(() => t('login_enter_button'))


    const email = ref('')
    const password = ref('')
    const error = ref(null) 
    const loading = ref(false) 
    const langMenuVisible = ref(false)

    const languages = [
      { code: 'pt-BR', name: 'Português', icon: 'flag-icon flag-icon-br' }, 
      { code: 'en-US', name: 'English (US)', icon: 'flag-icon flag-icon-us' }, 
      { code: 'es', name: 'Español', icon: 'flag-icon flag-icon-es' },
      { code: 'fr', name: 'Français', icon: 'flag-icon flag-icon-fr' },
    ]

    const changeLanguage = (langCode) => {
      // Diagnostic Log
      console.log('Mensagens atuais:', messages.value[langCode])
      
      locale.value = langCode
      localStorage.setItem('user-language', langCode)
      langMenuVisible.value = false
    }

    const handleLogin = async () => {
      console.log("Iniciando login, limpando cache local...");
      localStorage.clear(); // Limpeza preventiva de cache

      error.value = null 
      loading.value = true
      try {
        const response = await authService.login(email.value, password.value)
        const userDetails = response || {}
        
        let finalRole = (userDetails.role || 'GUEST').toString().trim().toUpperCase();
        
        // Regra de segurança temporária para o admin padrão (ajustado para o novo e-mail)
        if (email.value.toLowerCase().trim() === 'admin@admin.com') {
          console.log("Forçando role ADMIN para usuário mestre.");
          finalRole = 'ADMIN';
        }

        localStorage.setItem('userInfo', JSON.stringify({ 
          name: userDetails.userName || email.value.split('@')[0], 
          email: userDetails.userEmail || email.value, 
          role: finalRole
        }))

        $q.notify({
          type: 'positive',
          message: t('login_success_message'), 
          position: 'top'
        })

        router.push('/app/dashboard') 
      } catch (err) {
        let msg = t('login_error_message_default') 
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) msg = t('login_error_message_credentials')
          else msg = err.response.data?.message || t('login_error_message_server_generic')
        } else if (err.request) {
          msg = t('login_error_message_network')
        }
        $q.notify({ type: 'negative', message: msg, position: 'top' })
      } finally {
        loading.value = false
      }
    }

    return {
      logo, email, password, error, loading, handleLogin,
      locale, languages, changeLanguage, langMenuVisible,
      welcomeText, appName, makeLogin, happyToSeeYou, emailLabel, passwordLabel, enterButton, // Expose computed
      t, router // Return t and router to ensure availability
    }
  }
}
</script>