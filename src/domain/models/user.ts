// ユーザ情報を表現するクラス
export class User {
    // 表示名
    public screenName: string;
    
    // サインインID
    public signInId: string;
    
    // パスワード
    public password: string;
    
    constructor(screenName: string, signInId: string, password: string) {
        this.screenName = screenName;
        this.signInId = signInId;
        this.password = password;
    }
}