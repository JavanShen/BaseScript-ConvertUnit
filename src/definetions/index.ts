import { bytes } from './digital'
import { time } from './time'
import { metric, measure } from './length'

const definetions = {
    digital: {
        en: 'digtial',
        zh: '数字存储',
        data: bytes
    },
    time: {
        en: 'time',
        zh: '时间',
        data: time
    },
    length: {
        en: 'length',
        zh: '长度',
        data: {
            ...metric,
            ...measure
        }
    }
}

export default definetions
