<!-- 汎用ボタンコンポーネント。 -->
<script setup lang="ts">
    import '../assets/colors.css';

    export interface Props {
        text?: string;
        buttonStyle?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        text: '',
        buttonStyle: 'mid',
    });
</script>

<template>
    <button class="dark" v-if="buttonStyle === 'dark'">{{ text }}</button>
    <button class="light" v-else-if="buttonStyle === 'light'">{{ text }}</button>
    <button class="mid" v-else>{{ text }}</button>
</template>

<style scoped>
    @import url('../assets/colors.css');

    button {
        border-color: transparent;
        border-radius: 5px;
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        width: 100%;
        height: 100%;
    }

    button:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    .dark {
        background-color: var(--dark-color);
        color: white;
    }

    .dark:active {
        background-color: var(--mid-color);
    }

    .mid {
         background-color: var(--mid-color);
         color: white;
    }

    .mid:active {
        background-color: var(--light-color);
    }

    .light {
        background-color: var(--light-color);
    }

    .light:active {
        background-color: var(--mid-color);
    }
</style>