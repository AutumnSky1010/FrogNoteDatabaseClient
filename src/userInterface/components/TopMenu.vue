<!-- 最上部メニュー用コンポーネント -->
<script setup lang="ts">
import { ref } from 'vue';
import FrogNoteButton from './FrogNoteButton.vue';
import { useSignInUserStore } from '../../application/stores/authorizations/signInUser';
import { computed } from '@vue/reactivity';
import { UserUC } from '../../application/usecases/userUC';

export interface Props {
    isAuthorized: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    isAuthorized: false
});
const store = useSignInUserStore();
const userUC = new UserUC();
const screenName = computed( () => {
    return store.getUser?.screenName;
});

const isUserPopupOpened = ref(false);

function toggleIsUserPopupOpened(): void {
    isUserPopupOpened.value = !isUserPopupOpened.value;
}

</script>

<template>
    <header class="top_menu">
        <div v-if="isAuthorized" class="right">
            <div class="button">
                <FrogNoteButton class="user_button" :text="screenName" @click="toggleIsUserPopupOpened" button-style="light" />
            </div>
            <div class="user_popup" v-if="isUserPopupOpened">
                <button class="popup_button" @click="userUC.signOut(); toggleIsUserPopupOpened();">ログアウト</button>
                <button class="popup_button" @click="userUC.leave(); toggleIsUserPopupOpened();"><span style="color: #ff0000;">アカウント削除</span></button>
            </div>
        </div>
        <div class="right" v-else>
            <div class="button">
                <FrogNoteButton @click="$emit('sign-in-func')" text="ログイン" button-style="light" />
            </div>
            <div class="button">
                <FrogNoteButton @click="$emit('sign-up-func')" text="アカウント作成" button-style="light" />
            </div>
        </div>
    </header>
</template>

<style scoped>
.button {
    width: 150px;
    margin: 10px;
}

.popup_button {
    background-color: transparent;
    width: 100%;
    padding: 10px;
    text-align: left;
    border: none;
}

.popup_button:hover {
    background-color: ghostwhite;
}

.popup_button:active {
    background-color: lightgray;
}

.user_popup {
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    width: 200px;
    margin: 10px;
    top: 50px;
    z-index: 10;
    box-shadow: 0px 1px 30px 3px rgba(0, 0, 0, .3);
    position: absolute;
}

.top_menu {
    background-color: #087F23;
    height: 60px;
    width: 100%;
    box-shadow: 0px 1px 30px 3px rgba(0, 0, 0, .3);
    z-index: 1;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
}

.right {
    justify-content: right;
    width: 100%;
    display: flex;
}
</style>