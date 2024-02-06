import { bytes } from './digital'
import { time } from './time'
import { metric as lmetric, measure as lmeasure } from './length'
import { metric as smetric, imperial as simperial } from './speed'
import { metric as mmetric, imperial as mimperial } from './mass'
import { metric as tmetric, imperial as timperial } from './temperature'

const definetions = {
    length: {
        en: 'length',
        zh: '长度',
        data: {
            ...lmetric,
            ...lmeasure
        }
    },
    mass: {
        en: 'mass',
        zh: '质量',
        data: {
            ...mmetric,
            ...mimperial
        }
    },
    temperature: {
        en: 'temperature',
        zh: '温度',
        data: {
            ...tmetric,
            ...timperial
        }
    },
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
    speed: {
        en: 'speed',
        zh: '速度',
        data: {
            ...smetric,
            ...simperial
        }
    }
}

export default definetions
