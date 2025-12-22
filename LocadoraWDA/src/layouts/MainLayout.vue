<template>
  <q-layout view="lHh Lpr lFf">
    <q-header style="background-color: #0d1b2a; color: white">
      <q-toolbar>
        <div class="header-left">
          <q-btn
            class="menu-btn"
            dense
            round
            flat
            icon="menu"
            :aria-label="$t('MainLayout.menu_aria_label')"
            @click="toggleLeftDrawer"
          />
        </div>
        <div class="header-center">
          <q-toolbar-title>
            <span class="app-title">{{ $t('MainLayout.app_title') }}</span>
          </q-toolbar-title>
        </div>

        <div>
          <q-btn-dropdown
            class="MenuBTN"
            color="purple"
            :label="$q.screen.xs ? $t('MainLayout.user_short_label') : $t('MainLayout.user_full_label')"
            content-class="menu-transparente"
          >
            <div class="modalMenu q-pa-md">
              <div class="colomn q-pr-lg menu-container-small"> 
                
                <div class="text-h5 q-mb-md">{{ $t('MainLayout.user_info_title') }}</div>
                <div class="info">
                  👤 {{ $t('MainLayout.user_name_label') }}: <span>{{ userInfo.name }}</span>
                </div>
                <div class="info">
                  📧 {{ $t('MainLayout.user_email_label') }}: <span>{{ userInfo.email }}</span>
                </div>
                <div class="info q-mb-sm">
                  🔑 {{ $t('MainLayout.user_permission_label') }}: <span>{{ roleMap[userInfo.role] || userInfo.role }}</span>
                </div>

                <q-separator class="q-my-sm" /> 
                
                <div class="q-mb-sm row q-gutter-xs justify-start">
                    <q-btn
                        v-for="lang in langOptions"
                        :key="lang.value"
                        dense
                        flat
                        round
                        class="flag-btn"
                        :icon="getFlagIcon(lang.value)" 
                        :color="language === lang.value ? 'primary' : 'grey-7'"
                        @click="setLanguage(lang.value)"
                        :tooltip="lang.label"
                    />
                </div>

                <q-separator class="q-my-sm" />

                <q-btn
                  class="MenuBTN"
                  id="MenuBTN"
                  color="primary"
                  :label="$t('MainLayout.logout_button')"
                  @click="handleLogout"
                />
              </div>
            </div>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="drawer-main"
      :width="
        $q.screen.xs
          ? 250
          : $q.screen.sm
          ? 220
          : $q.screen.md
          ? 200
          : $q.screen.lg
          ? 300
          : 300
      "
      style="background-color: #0d1b2a; color: white"
    >
      <div class="logoWDAALL">
        <img :src="logo" alt="WDA GROUP LOGO.png" />
      </div>
      <q-list class="drawer-list">
        <div class="drawer-links">
          <EssentialLink
            v-for="link in translatedLinksList" 
            :key="link.title"
            v-bind="link"
          />
        </div>
      </q-list>
      <q-item 
        clickable 
        @click="handleLogout" 
        class="q-ma-sm" 
        style="padding-top: 7%; padding-bottom: 7%;"
      >
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('MainLayout.logout_button') }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>
    
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router'; 
import { useI18n } from 'vue-i18n'; 
import { useQuasar } from 'quasar';
import EssentialLink from "components/EssentialLink.vue";
import logo from "src/assets/image.png";

// Imports de bandeiras (Assumindo que os caminhos estão corretos)
import bandeiraBr from "src/assets/brasilia.png"; 
import bandeiraUs from "src/assets/estados-unidos.png"; 
import bandeiraFr from "src/assets/franca.png"; 
import bandeiraEs from "src/assets/espanha.png"; 

const $q = useQuasar();
const router = useRouter(); 
const { t, locale } = useI18n(); 

defineOptions({
  name: "MainLayout",
});

// --- ESTADO DO USUÁRIO ---
const userInfo = ref({
    name: 'Carregando...', 
    email: '',
    role: '', 
});

const roleMap = computed(() => ({
    // As chaves precisam ser MAIÚSCULAS
    USER: t('UsersPage.role_user'), 
    ADMIN: t('UsersPage.role_admin'), 
    GUEST: t('general.guest_user') || 'Visitante', // Fallback
}));

/**
 * Carrega as informações do usuário do localStorage e garante que a role esteja em MAIÚSCULAS.
 */
function loadUserInfo() {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
        try {
            const user = JSON.parse(storedUserInfo);
            
            userInfo.value.name = user.name || 'Nome Indisponível';
            userInfo.value.email = user.email || 'Email Indisponível';
            
            // 🎯 CORREÇÃO FINAL: Garante que é uma string, converte para maiúsculas
            const userRole = user.role;
            if (typeof userRole === 'string') {
                userInfo.value.role = userRole.toUpperCase();
            } else {
                userInfo.value.role = 'GUEST'; 
            }

        } catch (e) {
            console.error("Erro ao parsear dados do usuário do localStorage:", e);
            handleLogout(); 
        }
    } else {
        if (!localStorage.getItem('authToken')) {
            console.warn("Nenhum dado de autenticação encontrado. Redirecionando.");
            handleLogout(); 
        }
    }
}

// Chamado ao iniciar o componente
onMounted(() => {
    loadUserInfo();
});


// --- Configuração de Idioma ---
const language = ref(locale.value); 
const langOptions = [
    { label: 'Português', value: 'pt-BR' },
    { label: 'English', value: 'en-US' },
    { label: 'Español', value: 'es' },
    { label: 'Français', value: 'fr' },
];
const flagImageMap = {
    'pt-BR': bandeiraBr,
    'en-US': bandeiraUs,
    'fr': bandeiraFr,
    'es': bandeiraEs,
};
function getFlagIcon(langCode) {
    const path = flagImageMap[langCode];
    return `img:${path}`; 
}
function setLanguage(newLang) {
    language.value = newLang; 
    locale.value = newLang; 
    localStorage.setItem('user-language', newLang); 
    $q.notify({
        type: 'info',
        message: t('general.language_updated'),
        timeout: 1000
    });
}

// --- Links do Menu Lateral e Lógica ---
const baseLinksList = [
    { titleKey: "MainLayout.link_dashboard", link: "/dashboard", icon: "dashboard" },
    { titleKey: "MainLayout.link_renters", link: "/locatario", icon: "people" },
    { titleKey: "MainLayout.link_publishers", link: "/editoras", icon: "library_books" },
    { titleKey: "MainLayout.link_books", link: "/livros", icon: "menu_book" },
    { titleKey: "MainLayout.link_rentals", link: "/alugueis", icon: "event" },
    { titleKey: "MainLayout.link_users", link: "/usuario", icon: "manage_accounts" },
];

const translatedLinksList = computed(() => {
    return baseLinksList.map(link => ({
        title: t(link.titleKey), 
        link: link.link,
        icon: link.icon,
        style: "padding-top: 7%; padding-bottom: 7%;", 
    }));
});

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

/**
 * Função de logout: Limpa o armazenamento local e redireciona para a página de login.
 */
async function handleLogout() {
  console.log("Executando logout e limpando sessão...");
  
  // 1. Limpar dados de autenticação no LocalStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('user-language'); 

  // 2. Notificar o usuário
  $q.notify({
      type: 'info',
      message: t('MainLayout.logout_success_message') || 'Sessão encerrada com sucesso!',
      timeout: 2000,
      position: 'top'
  });
  
  // 3. Redirecionar para a tela de login (/)
  try {
      await router.replace({ path: '/' }); 
  } catch (error) {
      console.error("Erro durante a navegação após logout:", error);
      window.location.href = '/'; 
  }
}
</script>