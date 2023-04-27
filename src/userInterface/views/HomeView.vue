<!-- 一番最初に表示される画面。 -->
<script setup lang="ts">
import { ref, type Ref } from 'vue';
import BackupCard from '../components/BackupCard.vue';
import FrogNoteButton from '../components/FrogNoteButton.vue';
import TopMenu from '../components/TopMenu.vue';
import DialogHost from '../components/DialogHost.vue'
import TextBox from '../components/TextBox.vue'
import type { BackupMeta } from '../../domain/models/backup';
import { UserUC } from '../../application/usecases/userUC';
import { User } from '../../domain/models/user';
import { BackupUC } from '../../application/usecases/backupUC';
import { useBackupsStore } from '../../application/stores/backups';
import '../assets/colors.css';
import { useSignInUserStore } from '../../application/stores/authorizations/signInUser';

class HomeViewModel {
    public backups: Ref<BackupMeta[]>;
    public password = ref('');
    public screenName = ref('');
    public signInId = ref('');
    public isAuthorized = ref(false);
    public isSignInDialogOpened = ref(false);
    public isSignUpDialogOpened = ref(false);
    public isUploadDialogOpened = ref(false);


    constructor() {
        const backupStore = useBackupsStore();
        this.backups = ref(backupStore.backups);
        backupStore.$subscribe((mutation, state) => {
            this.backups.value = state.backups;
        });
        const signInStore = useSignInUserStore();
        signInStore.$subscribe((mutation, state) => {
            this.isAuthorized.value = state.token !== undefined;
        });
    }
}

abstract class HomeVMCommandBase {
    protected homeVM: HomeViewModel;
    constructor(homeVM: HomeViewModel) {
        this.homeVM = homeVM;
    }
}

class DialogCommands extends HomeVMCommandBase {

    constructor(homeVM: HomeViewModel) {
        super(homeVM);
    }

    public toggleIsSignInDialogOpened(): void {
        this.homeVM.isSignInDialogOpened.value = !this.homeVM.isSignInDialogOpened.value;
    }

    public toggleIsSignUpDialogOpened(): void {
        this.homeVM.isSignUpDialogOpened.value = !this.homeVM.isSignUpDialogOpened.value;
    }

    public toggleIsUploadDialogOpened(): void {
        this.homeVM.isUploadDialogOpened.value = !this.homeVM.isUploadDialogOpened.value;
    }
}

class TextInputCommands extends HomeVMCommandBase {
    constructor(homeVM: HomeViewModel) {
        super(homeVM);
    }

    public inputPassword(e: Event): void {
        const target = (<HTMLInputElement>e.target);
        this.homeVM.password.value = target.value;
    }

    public inputSignInId(e: Event): void {
        const target = (<HTMLInputElement>e.target);
        this.homeVM.signInId.value = target.value;
    }

    public inputScreenName(e: Event): void {
        const target = <HTMLInputElement>e.target;
        this.homeVM.screenName.value = target.value;
    }
}

const userUC = new UserUC();
const backupUC = new BackupUC();
const homeVM = new HomeViewModel();
const dialogCommands = new DialogCommands(homeVM);
const textInputCommands = new TextInputCommands(homeVM);


function register(): void {
    const user = new User(homeVM.screenName.value, homeVM.signInId.value, homeVM.password.value);
    userUC.create(user);
    dialogCommands.toggleIsSignUpDialogOpened();
}

function upload(): void {
    const input = <HTMLInputElement>document.getElementById('upload_input');
    if (input.files === null || input.files.length !== 1) {
        return;
    }
    backupUC.upload(input.files[0]);
    dialogCommands.toggleIsUploadDialogOpened();
}

</script>

<template>
    <DialogHost :is-dialog-opened="homeVM.isSignInDialogOpened.value">
        <div class="dialog_content">
            <p>ログイン</p>
            <div class="dialog_text_boxes">
                <TextBox class="text_box" placeholder="ID" @on-input="event => textInputCommands.inputSignInId(event)"></TextBox>
                <TextBox class="text_box" placeholder="パスワード" type="password" @on-input="event => textInputCommands.inputPassword(event)"></TextBox>
            </div>
            <div class="dialog_buttons">
                <FrogNoteButton text="やめる" @click="dialogCommands.toggleIsSignInDialogOpened()"></FrogNoteButton>
                <FrogNoteButton text="ログイン"
                    @click="() => { userUC.signIn(homeVM.signInId.value, homeVM.password.value); dialogCommands.toggleIsSignInDialogOpened(); }">
                </FrogNoteButton>
            </div>
        </div>
    </DialogHost>
    <DialogHost :is-dialog-opened="homeVM.isSignUpDialogOpened.value">
        <div class="dialog_content">
            <p>アカウント作成</p>
            <div class="dialog_text_boxes">
                <TextBox class="text_box" placeholder="表示される名前" @on-input="event => textInputCommands.inputScreenName(event)"></TextBox>
                <TextBox class="text_box" placeholder="ID" @on-input="event => textInputCommands.inputSignInId(event)"></TextBox>
                <TextBox class="text_box" placeholder="パスワード" type="password" @on-input="event =>textInputCommands.inputPassword(event)"></TextBox>
            </div>
            <div class="dialog_buttons">
                <FrogNoteButton text="やめる" @click="dialogCommands.toggleIsSignUpDialogOpened()"></FrogNoteButton>
                <FrogNoteButton text="登録" @click="register"></FrogNoteButton>
            </div>
        </div>
    </DialogHost>
    <DialogHost :is-dialog-opened="homeVM.isUploadDialogOpened.value">
        <div class="dialog_content">
            <input id="upload_input" type="file" accept=".fnb" @change="event => { }" />
            <div class="dialog_buttons">
                <FrogNoteButton text="やめる" @click="event => dialogCommands.toggleIsUploadDialogOpened()"></FrogNoteButton>
                <FrogNoteButton text="アップロード" @click="upload"></FrogNoteButton>
            </div>
        </div>
    </DialogHost>
    <TopMenu :is-authorized="homeVM.isAuthorized.value" @sign-in-func="dialogCommands.toggleIsSignInDialogOpened()"
        @sign-up-func="dialogCommands.toggleIsSignUpDialogOpened()" />
    <div class="main">
        <div class="top">
            <h1>バックアップ一覧</h1>
            <p>バックアップの削除、ダウンロードが行えます。</p>
            <div class="line"></div>
        </div>
        <div class="backup_list">
            <BackupCard v-for="backup in homeVM.backups.value" :backup="backup" />
        </div>
        <button v-if="homeVM.isAuthorized.value" class="add_button"
            @click="dialogCommands.toggleIsUploadDialogOpened()">+</button>
    </div>
</template>

<style scoped>
.main {
    position: relative;
}

#upload_input {
    margin: 20px;
}

.add_button {
    border-radius: 100%;
    position: absolute;
    background-color: var(--dark-color);
    width: 50px;
    height: 50px;
    border-color: transparent;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    bottom: 50px;
    right: 100px;
    color: white;
    font-size: 16pt;
}

.add_button:active {
    background-color: var(--mid-color);
}

.dialog_content {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
}

.dialog_content>p {
    font-size: 24pt;
    margin: 20px 0px 60px 0px;
}

.dialog_content>.dialog_text_boxes {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
}

.dialog_content>.dialog_text_boxes>.text_box {
    margin: 30px auto;
    width: 100%;
}

.dialog_content .dialog_buttons {
    width: 100%;
    display: flex;
    justify-content: space-around;
}

.dialog_content .dialog_buttons>* {
    margin: 10px;
    height: 40px;
    width: 200px;
}

.top {
    margin: 20px;
    height: 100px;
}

.line {
    height: 2px;
    width: 100%;
    margin: 10px 0;
    background-color: ghostwhite;
}

.backup_list {
    margin: 20px;
    height: calc(100vh - 240px);
    overflow-y: scroll;
}

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
    height: 60vh;
    width: 60vw;
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