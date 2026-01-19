import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import allMessages from 'src/i18n/index.js'

// Packs de idioma do próprio Quasar
import qPtBr from 'quasar/lang/pt-BR'
import qEnUs from 'quasar/lang/en-US'
import qEs from 'quasar/lang/es'
import qFr from 'quasar/lang/fr'

const quasarLangPacks = {
  'pt-BR': qPtBr,
  'en-US': qEnUs,
  'es': qEs,
  'fr': qFr
}

let i18n

export default boot(({ app }) => {
  let savedLang = localStorage.getItem('user-language')

  const allowedLanguages = ['pt-BR', 'en-US', 'es', 'fr']
  if (!savedLang || !allowedLanguages.includes(savedLang)) {
    savedLang = 'pt-BR'
  }

  // Unwrap messages logic
  const messages = {}
  Object.keys(allMessages).forEach(key => {
    messages[key] = allMessages[key].default || allMessages[key]
  })

  console.log('[i18n Boot] Initializing i18n with Unwrapping...')
  console.log('[i18n Boot] Unwrapped Messages Keys:', Object.keys(messages))
  // Log a specific key to verify deep structure
  if (messages['pt-BR']) {
    console.log('[i18n Boot] Check pt-BR structure (login.welcome_to):', messages['pt-BR'].login?.welcome_to)
  }

  i18n = createI18n({
    locale: savedLang, // Use the validated language
    fallbackLocale: 'pt-BR',
    messages,
    legacy: false, // Voltamos para Composition API Standard
    globalInjection: true, // Injeta $t globalmente
  })

  // FORCE REACTIVE LOCALE SYNC
  i18n.global.locale.value = savedLang

  // Set i18n instance on app
  app.use(i18n)

  // Configuração do Quasar Lang
  const langPack = quasarLangPacks[savedLang] || qPtBr
  import('quasar').then(({ Quasar }) => {
    Quasar.lang.set(langPack)
  })
})

export { i18n }