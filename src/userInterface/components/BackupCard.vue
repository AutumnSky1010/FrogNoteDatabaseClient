<!-- バックアップデータ表示用コンポーネント。 -->
<script setup lang="ts">
import { ref } from 'vue';
import FrogNoteButton from './FrogNoteButton.vue';
import type { BackupMeta } from '../../domain/models/backup';
import { BackupUC } from '../../application/usecases/backupUC';

export interface Props {
    backup: BackupMeta;
}
const props = defineProps<Props>();

const backupUC = new BackupUC();

function download(): void {
    backupUC.download(props.backup);
}

function deleteBackup(): void {
    backupUC.delete(props.backup);
}

</script>

<template>
    <div class="card">
        <p>{{ backup.savedAt }}</p>
        <div class="buttons">
            <FrogNoteButton @click="download" text="ダウンロード" buttonStyle="dark" />
            <FrogNoteButton @click="deleteBackup" text="削除" buttonStyle="dark" />
        </div>
    </div>
</template>

<style scoped>
.card {
    background-color: white;
    border-radius: 3px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.3);
    padding: 10px;
    margin: 15px;
}

p {
    font-size: 16pt;
    margin: 10px;
}

.buttons {
    display: flex;
    justify-content: right;
}

.buttons>* {
    width: 100px;
    margin: 10px;
}
</style>