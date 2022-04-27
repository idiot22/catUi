import type { ExtractPropTypes } from 'vue'
import { UPDATE_MODEL_EVENT } from '@cat-ui/utils/constData'
import { defaultProps } from '@cat-ui/mixins/useDefault'
import { isString } from '@cat-ui/utils/typeJudge'

export const componentProps = {
    ...defaultProps
}

export type ComponentProps = ExtractPropTypes<typeof componentProps>

export const componentEmits = {
    [UPDATE_MODEL_EVENT]: (value: string) => isString(value)
}

export type ComponentEmits = typeof componentEmits
