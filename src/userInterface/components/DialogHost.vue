<!-- ダイアログをホストするコンポーネント。 -->
<script setup lang="ts">
import { ref } from 'vue';

export interface Props {
    isDialogOpened: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    isDialogOpened: false
})

</script>

<template>
    <Transition>
        <div class="dialog_host" v-if="isDialogOpened">
            <div class="overlay">
                <div class="dialog">
                    <slot></slot>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.overlay {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .5);
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dialog {
    background-color: white;
    width: 40vw;
    margin: 10px;
    padding: 20px;
    border-radius: 10px;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
    z-index: 2147483647;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    z-index: 2147483647;
}
</style>