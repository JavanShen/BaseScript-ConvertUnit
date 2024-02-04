<template>
    <AForm>
        <AFormItem>
            <ASelect
                v-model:value="measurement"
                :options="
                    Object.keys(definetions).map(item => ({
                        value: item,
                        label: $t(`${item}.unit`)
                    }))
                "
            />
        </AFormItem>
        <AFormItem>
            <AFlex>
                <AInputNumber v-model:value="num1" class="flex-1" />
                <ASelect
                    v-model:value="unit1"
                    :options="unitOptions"
                    class="m-l-10 flex-2"
                />
            </AFlex>
        </AFormItem>
        <AFormItem>
            <AFlex>
                <AInputNumber v-model:value="num2" class="flex-1" />
                <ASelect
                    v-model:value="unit2"
                    :options="unitOptions"
                    class="m-l-10 flex-2"
                />
            </AFlex>
        </AFormItem>
    </AForm>
</template>

<script lang="ts" setup>
import definetions from '../definetions'
type Definetions = typeof definetions

import { useI18n } from 'vue-i18n'
import configureMeasurements from 'convert-units'
import allMeasures from 'convert-units/definitions/all'

const convert = configureMeasurements(allMeasures)

const { t } = useI18n()

const measurement = ref(Object.keys(definetions)[0])
const num1 = ref<number>()
const num2 = ref<number>()
const unit1 = ref('')
const unit2 = ref('')

watch(measurement, () => {
    unit1.value = ''
    unit2.value = ''
})

watch([unit1, unit2, num1, num2], ([u1, u2, n1, n2], [ou1, ou2, on1, on2]) => {
    return
    if(u1 === ou1 && u2 === ou2 && n1 === on1 && n2 === on2) return

    if (!(u1 && u2 && (n1 || n2))) return

    console.log(n1, n2)
    if(n1) num2.value = convert(n1).from(u1).to(u2)
    if(n2) num1.value = convert(n2).from(u2).to(u1)
})

const unitOptions = computed(() => {
    if (!measurement.value) return []

    const curMeas = definetions[measurement.value as keyof Definetions].data

    return Object.keys(curMeas).map(item => ({
        value: item,
        label: t(`${measurement.value}.${item}`)
    }))
})
</script>
