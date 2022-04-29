import type { ExtractPropTypes } from 'vue'
import { PropType } from 'vue'

// 默认属性
export const defaultProps = {
    id: {
        type: [String, Number],
        required: true
    },
    name: {
        type: String
    },
    style: {
        type: String
    },
    class: {
        type: String
    },
    attribute: {
        type: Object as PropType<Record<string, string>>
    },
    enabled: {
        type: Boolean,
        default: true
    },
    visibility: {
        type: Boolean,
        default: true
    }
}

export type DefaultProps = ExtractPropTypes<typeof defaultProps>
