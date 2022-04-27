/*
 * @Author: your name
 * @Date: 2022-04-27 23:49:56
 * @LastEditTime: 2022-04-28 00:11:11
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /catUi/packages/mixins/useDefault.ts
 */
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
