import { BackupMeta } from "../../domain/models/backup";
import { APIRepositoryBase } from "./apiRepositorybase";

// 【規則】
// apiのURIに対応したメソッド名にする。

// バックアップ関連のAPIにアクセスする。
export class BackupRepository extends APIRepositoryBase {
    // ダウンロードする。
    public async download(token: string, BackupMeta: BackupMeta): Promise<boolean> {
        const json = JSON.stringify({
            value: BackupMeta.backupId
        });
        const requestHeaders = this.getHeaders(true, json.length);
        this.setToken(requestHeaders, token);
        const response = await fetch('http://localhost:8080/backup/download', {
            method: 'POST',
            headers: requestHeaders,
            body: json
        });
        if (response.status === 200 && response.body !== null) {
            const blob = await response.blob();
            var a = document.createElement('a');
            a.download = `${BackupMeta.savedAt}.fnb`;
            a.href = URL.createObjectURL(blob);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return true;
        }
        return false;
    }

    // 削除する。
    public async delete(token: string, BackupMeta: BackupMeta) : Promise<boolean> {
        const json = JSON.stringify({
            value: BackupMeta.backupId
        });
        const requestHeaders = this.getHeaders(true, json.length);
        this.setToken(requestHeaders, token);
        const response = await fetch('http://localhost:8080/backup/delete', {
            method: 'DELETE',
            headers: requestHeaders,
            body: json
        });
        return response.status === 200;
    }

    // ユーザが持つすべてのバックアップメタデータを取得する。
    public async allMeta(token: string): Promise<BackupMeta[]> {
        const requestHeaders = this.getHeaders();
        this.setToken(requestHeaders, token);
        const response = await fetch('http://localhost:8080/backup/allmeta', {
            method: 'GET',
            headers: requestHeaders
        });
        if (response.status !== 200){
            return [];
        }
        const json: any[] = await response.json();
        let result: BackupMeta[] = [];
        for(let meta of json) {
            result.push(new BackupMeta(meta.savedAt, meta.backupId));
        }
        return result;
    }

    // バックアップファイルを保存する。
    public async save(token: string, file: File): Promise<boolean> {
        const requestHeaders = this.getHeaders();
        this.setToken(requestHeaders, token);
        const formData = new FormData();
        formData.append('backup', file, 'backup');
        const response = await fetch('http://localhost:8080/backup/save', {
            method: 'POST',
            headers: requestHeaders,
            body: formData
        })
        return response.status === 200;
    }
}