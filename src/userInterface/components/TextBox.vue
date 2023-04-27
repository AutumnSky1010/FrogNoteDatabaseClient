<!-- 汎用文字列入力用コンポーネント。 -->
<script setup lang="ts">
    import '../assets/colors.css'

    export interface Props {
        placeholder?: string;
        type?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        placeholder: '',
        type: 'text'
    })
</script>

<template>
    <input :placeholder="placeholder" :type="type" @input="$emit('on-input', $event)"/>
</template>

<style scoped>
    input {
        padding: 10px;
        font-size: 16pt;
        border-radius: 5px;
        border-color: var(--dark-color);
        outline: 0;
    }

    input:focus {
        outline: none;
        border-color: var(--light-color);
    }
</style>