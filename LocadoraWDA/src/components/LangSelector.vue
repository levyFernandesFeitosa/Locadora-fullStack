<template>
  <div class="q-pa-md">
    <!-- 1. Botão que exibe o idioma atual (bandeira e código) -->
    <!-- Usamos 'flat' e 'q-px-sm' para um visual discreto no cabeçalho -->
    <q-btn flat class="q-px-sm" :ripple="false">
      <div class="row items-center no-wrap">
        <!-- Bandeira do idioma atual -->
        <span :class="['flag-icon', currentLang.flagClass]"></span>
        <!-- Código do idioma atual -->
        <span class="q-ml-sm text-sm">{{ currentLang.code }}</span>
      </div>

      <!-- 2. QMenu: Abre automaticamente ao clicar no QBtn -->
      <q-menu fit auto-close class="bg-white rounded-lg shadow-lg">
        <q-list dense separator>
          <q-item
            v-for="lang in langOptions"
            :key="lang.value"
            clickable
            @click="changeLanguage(lang.value)"
            :active="locale === lang.value"
            active-class="bg-blue-1 text-primary"
            class="q-pa-sm"
          >
            <q-item-section avatar>
              <!-- Bandeira na Lista -->
              <span :class="['flag-icon', lang.flagClass]"></span>
            </q-item-section>
            <q-item-section>
              <!-- Rótulo do Idioma -->
              {{ lang.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <!-- Estilos CSS para as bandeiras (usando Emojis para compatibilidade) -->
    <q-card-section>
        <style scoped>
            .flag-icon {
                font-size: 24px;
                line-height: 1;
                display: inline-block;
            }
            /* Mapeamento de Classes para Emojis de Bandeiras */
            .flag-icon.pt-BR::after { content: "🇧🇷"; }
            .flag-icon.en-US::after { content: "🇺🇸"; }
            .flag-icon.es::after { content: "🇪🇸"; }
            .flag-icon.fr::after { content: "🇫🇷"; }
            
            .text-sm {
                font-size: 0.875rem; /* Tamanho pequeno */
                font-weight: 600;
            }
        </style>
    </q-card-section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';

// Obtém o objeto i18n e o locale reativo
const { locale } = useI18n({ useScope: 'global' });
const $q = useQuasar();

// Define as opções de idioma disponíveis
const langOptions = [
  { value: 'pt-BR', label: 'Português (BR)', flagClass: 'pt-BR', code: 'PT' },
  { value: 'en-US', label: 'English (US)', flagClass: 'en-US', code: 'EN' },
  { value: 'es', label: 'Español', flagClass: 'es', code: 'ES' },
  { value: 'fr', label: 'Français', flagClass: 'fr', code: 'FR' },
];

// Propriedade computada para encontrar o idioma atualmente selecionado
const currentLang = computed(() => {
    return langOptions.find(lang => lang.value === locale.value) || langOptions[0];
});

// Função para alterar a linguagem do Vue I18n e do Quasar
const changeLanguage = async (newLocale) => {
    locale.value = newLocale; // 1. Altera o locale do Vue I18n

    // 2. Mudar a linguagem dos componentes Quasar
    try {
        const langPack = await import(`quasar/lang/${newLocale}.mjs`);
        $q.lang.set(langPack.default);
    } catch (err) {
        console.error(`[LangSelector] Não foi possível carregar a linguagem do Quasar para ${newLocale}.`, err);
    }
};
</script>
 