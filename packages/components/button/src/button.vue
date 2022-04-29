<template>
    <div></div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { buttonEmits, buttonProps } from './button'

export default defineComponent({
    name: 'RcComponent',
    props: buttonProps,
    emit: buttonEmits,
    setup (props, { emit }) {
        // template
    }
})
</script>
