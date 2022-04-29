import type { ExtractPropTypes } from 'vue'
import { UPDATE_MODEL_EVENT } from '@cat-ui/utils/constData'
import { defaultProps } from '@cat-ui/mixins/useDefault'
import { isString } from '@cat-ui/utils/typeJudge'

export const buttonProps = {
    ...defaultProps
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>

export const buttonEmits = {
    [UPDATE_MODEL_EVENT]: (value: string) => isString(value)
}

export type ButtonEmits = typeof buttonEmits
