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
      
      <div 
        class="containerLeft col-md-5 hidden-sm hidden-xs" 
        style="border-radius: 3vh;"
      >
        <div class="flex">
          <div class="contentLeft"> 
            <div class="logoWDA"><img :src="logo" alt="Logo WDA" /></div>
            <div class="text1">{{ t('login.welcome_to') }}</div>
            <div class="text2">{{ t('login.app_name') }}</div>
          </div>
        </div>
      </div>
      
      <div class="containerRight col-xs-12 col-sm-12 col-md-7">
        <q-card flat class="full-width" >
          <q-card-section>
            <div class="text3">{{ t('login.make_your_login') }}</div>
            <div class="text4">{{ t('login.happy_to_see_you_again') }}</div>
          </q-card-section>
          
          <q-form class="campos" @submit.prevent="handleLogin">
            <q-input 
              filled 
              v-model="email" 
              :label="t('login.email_label')" 
              outlined 
              type="email" 
              required 
              :disable="loading"
            />
            <q-input 
              filled 
              v-model="password" 
              :label="t('login.password_label')" 
              type="password" 
              required 
              :disable="loading"
            />
            <q-btn 
              :label="t('login.enter_button')" 
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import authService from 'src/services/authService.js'; 
import logo from 'src/assets/image.png'; 
import { useI18n } from 'vue-i18n'; 
import { Lang } from 'quasar'; 
import langPtBr from 'quasar/lang/pt-BR';
import langEnUs from 'quasar/lang/en-US';
import langEs from 'quasar/lang/es';
import langFr from 'quasar/lang/fr';

const languagePacks = {
    'pt-BR': langPtBr,
    'en-US': langEnUs,
    'es': langEs,
    'fr': langFr,
};

export default {
  name: 'LoginPage', 
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const { t, locale } = useI18n(); 

    const email = ref('');
    const password = ref('');
    const error = ref(null); 
    const loading = ref(false); 
    const langMenuVisible = ref(false);

    const languages = [
      { code: 'pt-BR', name: 'Português', icon: 'flag-icon flag-icon-br' }, 
      { code: 'en-US', name: 'English (US)', icon: 'flag-icon flag-icon-us' }, 
      { code: 'es', name: 'Español', icon: 'flag-icon flag-icon-es' },
      { code: 'fr', name: 'Français', icon: 'flag-icon flag-icon-fr' },
    ];

    const changeLanguage = (langCode) => {
      locale.value = langCode;
      localStorage.setItem('user-language', langCode);
      langMenuVisible.value = false;
      
      const langPack = languagePacks[langCode];
      if (langPack) {
          Lang.set(langPack);
      }
    };

    const handleLogin = async () => {
      error.value = null; 
      loading.value = true;
      const loginEmail = email.value; 

      try {
        const response = await authService.login(loginEmail, password.value);
        let userRole = 'GUEST'; 
        let userName = loginEmail.split('@')[0];
        let userEmail = loginEmail;
        
        if (response && response.user) { 
            userName = response.user.name || userName;
            userEmail = response.user.email || userEmail;
            userRole = response.user.role || 'GUEST';
        } else if (response && response.data && response.data.user) { 
             userName = response.data.user.name || userName;
             userEmail = response.data.user.email || userEmail;
             userRole = response.data.user.role || 'GUEST';
        }
        
        localStorage.setItem('userInfo', JSON.stringify({ 
            name: userName, 
            email: userEmail, 
            role: userRole
        }));

        $q.notify({
          type: 'positive',
          message: t('login.success_message'), 
          position: 'top'
        });

        router.push('/dashboard'); 
        
      } catch (err) {
        loading.value = false;
        
        let msg = t('login.error_message_default'); 
        
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            msg = t('login.error_message_credentials');
          } else if (err.response.status === 400) {
            msg = err.response.data?.message || t('login.error_message_bad_request');
          } else if (err.response.data?.message) {
            msg = err.response.data.message;
          } else {
            msg = t('login.error_message_server_generic');
          }
        } else if (err.request) {
          msg = t('login.error_message_network');
        } else {
          msg = err.message || t('login.error_message_default');
        }
        
        error.value = msg; 
        
        $q.notify({
          type: 'negative',
          message: msg,
          position: 'top',
          timeout: 5000 
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      logo, 
      email,
      password,
      error,
      loading,
      handleLogin,
      locale,
      languages,
      changeLanguage,
      langMenuVisible,
      t, // Retornando a função 't' para uso no template
    };
  }
};
</script>