<template>
  <q-page class="flex flex-center q-pa-md" style="height: 100vh; background-color: #edead0;">
    
    <q-card class="q-card-login-responsive" style="border-radius: 3vh; max-width: 450px;">
      
      <div class="containerRight col-xs-12">
        <q-card flat class="full-width q-pa-lg" >
          <q-card-section class="text-center">
            <div class="text-h5 text-primary q-mb-sm">{{ $t('forgot.title') }}</div>
            <div class="text-subtitle1 text-grey-7">{{ $t('forgot.instruction') }}</div>
          </q-card-section>
          
          <q-form class="q-gutter-md q-pt-md" @submit.prevent="handleForgotPassword">
            <q-input 
              filled 
              v-model="email" 
              :label="$t('forgot.email_label')" 
              outlined 
              type="email" 
              required 
              :disable="loading || emailSent"
            />
            
            <div v-if="emailSent" class="text-positive text-center q-mt-md">
                {{ $t('forgot.success_message') }}
            </div>

            <q-btn 
              :label="emailSent ? $t('forgot.button_sent') : $t('forgot.button_send')" 
              type="submit" 
              color="primary" 
              class="full-width"
              :loading="loading"
              :disable="emailSent"
            />
          </q-form>

          <q-card-actions align="center" class="q-pt-lg">
            <q-btn
                flat
                dense
                color="grey-8"
                :label="$t('forgot.back_to_login')"
                @click="router.push('/')" 
                class="text-caption"
            />
          </q-card-actions>
        </q-card>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import authService from 'src/services/authService.js'; // Importe o serviço aqui

export default {
  name: 'ForgotPasswordPage',
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const { t } = useI18n(); 

    const email = ref('');
    const loading = ref(false); 
    const emailSent = ref(false);

    const handleForgotPassword = async () => {
      loading.value = true;
      
      try {
        // *** Você precisa criar esta função no seu authService.js ***
        // Ela deve chamar a sua API para gerar o token e enviar o email.
        await authService.requestPasswordReset(email.value); 
        
        emailSent.value = true;
        $q.notify({
          type: 'positive',
          message: t('forgot.success_message_notify'),
          position: 'top',
          timeout: 5000
        });

      } catch (err) {
        let msg = t('forgot.error_default');
        
        if (err.response && err.response.status === 404) {
             msg = t('forgot.error_not_found'); // E-mail não encontrado
        } else if (err.response && err.response.data?.message) {
            msg = err.response.data.message;
        } else if (err.request) {
            msg = t('forgot.error_network');
        }
        
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
      email,
      loading,
      emailSent,
      handleForgotPassword,
      router,
    };
  }
};
</script>