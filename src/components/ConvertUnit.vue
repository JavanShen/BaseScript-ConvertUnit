<template>
    <AFlex justify="end" class="m-b-20">
        <ASegmented :options="['单个', '整列']" v-model:value="mode" />
    </AFlex>
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
                <AInputNumber
                    v-if="mode === '单个'"
                    v-model:value="num1"
                    class="flex-1"
                    @change="manualConvert(1)"
                />
                <ASelect
                    class="flex-1"
                    v-else
                    placeholder="选择输入列"
                    :options="fieldMetaList"
                    :field-names="{ label: 'name', value: 'id' }"
                    v-model:value="fieldId1"
                />
                <ASelect
                    v-model:value="unit1"
                    :options="unitOptions"
                    class="m-l-10 flex-2"
                    @change="manualConvert(1)"
                />
            </AFlex>
        </AFormItem>
        <AFormItem>
            <AFlex>
                <AInputNumber
                    v-if="mode === '单个'"
                    v-model:value="num2"
                    class="flex-1"
                    readonly
                />
                <ASelect
                    class="flex-1"
                    v-else
                    placeholder="选择输出列"
                    :options="fieldMetaList"
                    :field-names="{ label: 'name', value: 'id' }"
                    v-model:value="fieldId2"
                />
                <ASelect
                    v-model:value="unit2"
                    :options="unitOptions"
                    class="m-l-10 flex-2"
                    @change="manualConvert(1)"
                />
            </AFlex>
        </AFormItem>
        <AFlex justify="center">
            <AButton type="primary" @click="fill">{{mode === '单个' ? '填充到当前位置' : '填充到所指定的列'}}</AButton>
        </AFlex>
    </AForm>
</template>

<script lang="ts" setup>
import definetions from '../definetions'
type Definetions = typeof definetions

import { useI18n } from 'vue-i18n'
import configureMeasurements from 'convert-units'
import allMeasures from 'convert-units/definitions/all'
import { bitable, type ICell, type INumberField } from '@lark-base-open/js-sdk'

const base = bitable.base
const { t } = useI18n()
const convert = configureMeasurements(allMeasures)

const mode = ref('单个')
const measurement = ref(Object.keys(definetions)[0])
const num1 = ref<number>()
const num2 = ref<number>()
const unit1 = ref<any>('')
const unit2 = ref<any>('')
const fieldId1 = ref<string>()
const fieldId2 = ref<string>()
let selectedCell: (ICell<number, number> & { val: number }) | null = null

const { state: fieldMetaList } = useAsyncState(async () => {
    const table = await base.getActiveTable()
    return await table.getFieldMetaListByType(2)
}, [])

base.onSelectionChange(async ({ data: { recordId, fieldId, tableId } }) => {
    if (!(tableId && fieldId && recordId)) return
    const curTable = await base.getTableById(tableId)

    const curField = await curTable.getFieldById<INumberField>(fieldId)

    if ((await curField.getType()) !== 2) return

    const curCell = (await curField.getCell(recordId)) as any
    if (curCell.val === null) return

    selectedCell = curCell
    num1.value = selectedCell?.val
    manualConvert(1)
})

watch(measurement, () => {
    unit1.value = ''
    unit2.value = ''
})

// 填充操作
const fillField = async () => {
    if(!(fieldId1.value && fieldId2.value)) return
    const table = await base.getActiveTable()

    const field1 = await table.getFieldById<INumberField>(fieldId1.value)
    const field2 = await table.getFieldById<INumberField>(fieldId2.value)

    const field1Values = await field1.getFieldValueList()

    for (const { record_id, value } of field1Values) {
        if (typeof value !== 'number') continue
        
        await field2.setValue(record_id, convert(value).from(unit1.value).to(unit2.value))
    }
}

const fillCell = () => num2.value && selectedCell?.setValue(num2.value)

const fill = () => mode.value === '单个' ? fillCell() : fillField()

/** 1: convertNum1 2: convertNum2 */
const manualConvert = (type: 1 | 2) => {
    if (!(unit1.value && unit2.value)) return

    type === 1 ? convertNum1() : convertNum2()
}
const convertNum1 = () => {
    num2.value = convert(num1.value).from(unit1.value).to(unit2.value)
}
const convertNum2 = () => {
    num1.value = convert(num2.value).from(unit2.value).to(unit1.value)
}

const unitOptions = computed(() => {
    if (!measurement.value) return []

    const curMeas = definetions[measurement.value as keyof Definetions].data

    return Object.keys(curMeas).map(item => ({
        value: item,
        label: t(`${measurement.value}.${item}`)
    }))
})
</script>
