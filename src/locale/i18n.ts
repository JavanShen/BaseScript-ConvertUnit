import { createI18n } from 'vue-i18n'
import { bitable } from '@lark-base-open/js-sdk'
import { mapValues } from 'lodash-es'
import definetions from '../definetions'

const getLanguageText = (language: 'zh' | 'en') =>
    mapValues(definetions, o => ({
        unit: o[language],
        ...mapValues(o.data, i => i[language])
    }))

export const i18n = createI18n({
    locale: 'en',
    allowComposition: true,
    legacy: false,
    messages: {
        en: getLanguageText('en'),
        zh: getLanguageText('zh')
    }
})

bitable.bridge.getLanguage().then(lang => {
    i18n.global.locale.value = lang as 'en'
})
