import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n';
// Importação direta dos arquivos para garantir que o bundler inclua o conteúdo
import ptBR from '../i18n/pt-BR';
import enUS from '../i18n/en-US';
import es from '../i18n/es';
import fr from '../i18n/fr';

const messages = {
    'pt-BR': ptBR,
    'en-US': enUS,
    'es': es,
    'fr': fr
};

export default ({ app }) => {
    
    const savedLang = localStorage.getItem('user-language');
    let initialLang = 'pt-BR'; 
    
    if (savedLang && messages[savedLang]) {
        initialLang = savedLang;
    }
    
    const i18n = createI18n({
        legacy: false, 
        locale: initialLang, 
        fallbackLocale: 'pt-BR', 
        globalInjection: true,
        messages // Agora o objeto 'messages' está garantidamente populado
    });

    app.use(i18n);

    return { i18n };
};