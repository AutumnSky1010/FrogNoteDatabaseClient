import { BackupRepository } from "../../infrastructure/api/backupRepository";
import type { BackupMeta } from "../../domain/models/backup";
import { useSignInUserStore } from "../../application/stores/authorizations/signInUser";
import { useBackupsStore } from "../../application/stores/backups";

export class BackupUC {
    readonly repos = new BackupRepository();

    public async update(): Promise<BackupMeta[]> {
        const signInStore = useSignInUserStore();
        const token = signInStore.token;
        const backupsStore = useBackupsStore();
        if (token === undefined){
            return backupsStore.getbackups;
        }
        const metas = await this.repos.allMeta(token);
        backupsStore.set(metas);
        return backupsStore.getbackups;
    }

    public async download(meta: BackupMeta): Promise<void> {
        const signInStore = useSignInUserStore();
        const token = signInStore.token;
        if (token === undefined){
            return;
        }
        this.repos.download(token, meta);
    }

    public async upload(file: File): Promise<BackupMeta[]> {
        const signInStore = useSignInUserStore();
        const token = signInStore.token;
        if (token === undefined){
            return [];
        }
        const ok = await this.repos.save(token, file);
        if (ok){
            this.update();
            const backupsStore = useBackupsStore();
            return backupsStore.getbackups;
        }
        return [];
    }

    public async delete(meta: BackupMeta): Promise<boolean> {
        const signInStore = useSignInUserStore();
        const token = signInStore.token;
        if (token === undefined){
            return false;
        }

        const ok = await this.repos.delete(token, meta);
        if (ok) {
            this.update();
            return true;
        }
        return false;
    }
}