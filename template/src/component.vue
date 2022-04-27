<template>
    <div></div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { componentEmits, componentProps } from './component'

export default defineComponent({
    name: 'RcComponent',
    props: componentProps,
    emit: componentEmits,
    setup (props, { emit }) {
        // template
    }
})
</script>
