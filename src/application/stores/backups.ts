import { defineStore } from 'pinia';
import type { BackupMeta } from '@/domain/models/backup';

// 現在閲覧しているバックアップデータの情報を表すインタフェース
export interface BackupsState {
    backups: BackupMeta[]
}

// 現在閲覧しているバックアップデータのストア。
export const useBackupsStore = defineStore({
    id: 'backups',
    state: (): BackupsState => {
        return { backups: [] };
    },
    getters: {
        getbackups: (state): BackupMeta[] => {
            return state.backups;
        }
    },
    actions: {
        add(backup: BackupMeta): void {
            this.backups.push(backup);
        },
        set(backups: BackupMeta[]): void {
          this.backups = backups;
        }
    }
});