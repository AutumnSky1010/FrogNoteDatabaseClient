// バックアップのメタデータを表現するクラス
export class BackupMeta {
	constructor(savedAt: string, backupId: number) {
		this.savedAt = savedAt;
		this.backupId = backupId;
	}

	// バックアップのID
	public backupId : number;

	// 保存日時
	public savedAt : string;
}