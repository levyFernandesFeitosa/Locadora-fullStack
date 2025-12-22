import { Lang } from 'quasar' 
import { boot } from 'quasar/wrappers'

import langPtBr from 'quasar/lang/pt-BR'
import langEnUs from 'quasar/lang/en-US'
import langEs from 'quasar/lang/es'
import langFr from 'quasar/lang/fr'

const languagePacks = {
    'pt-BR': langPtBr,
    'en-US': langEnUs,
    'es': langEs,
    'fr': langFr, 
}

export default boot(({ app, i18n }) => {
    
    if (!i18n) {
        Lang.set(languagePacks['pt-BR']); 
        return; 
    }
    
    const currentLangCode = i18n.global.locale.value; 

    const langPack = languagePacks[currentLangCode]
    
    if (langPack) {
        Lang.set(langPack) 
    } else {
        Lang.set(languagePacks['pt-BR'])
    }
});