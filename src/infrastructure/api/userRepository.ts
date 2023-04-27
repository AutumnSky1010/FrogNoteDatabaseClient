import { useSignInUserStore } from '../../application/stores/authorizations/signInUser'
import { User } from '../../domain/models/user';
import { APIRepositoryBase } from './apiRepositorybase';

// 【規則】
// apiのURIに対応したメソッド名にする。

export class UserRepository extends APIRepositoryBase {
    // 認証する（サインインする）。
    public async auth(signInId: string, password: string) : Promise<string> {
        const json = JSON.stringify({
            signInId: signInId,
            password: password   
        });

        const requestHeaders = this.getHeaders(true, json.length);
        const response = await fetch('http://localhost:8080/user/auth', {
            method: 'POST',
            headers: requestHeaders,
            body: json
        });
        if (response.status === 200) {
            return response.text();
        }
        return "";
    }
    
    // ユーザ情報を編集する。
    public async modify(user: User, token: string) : Promise<boolean> {
        const json = this.getUserJSON(user);
        const requestHeaders = this.getHeaders(true, json.length);
        this.setToken(requestHeaders, token);
        const response = await fetch('http://localhost:8080/user/modify', {
            method: 'PATCH', 
            headers: requestHeaders, 
            body: json
        });
        return response.status === 200;
    }

    // アカウントを削除する（退会）する。
    public async leave(user : User, token: string) : Promise<boolean> {
        const requestHeaders = this.getHeaders();
        this.setToken(requestHeaders, token);
        const response = await fetch('http://localhost:8080/user/leave', {
            method: 'DELETE',
            headers: requestHeaders
        });
        return response.status === 200;
    }
    
    // ユーザ情報を取得する。
    public async get(token: string) : Promise<User | undefined> {
        const requestHeaders = this.getHeaders();
        this.setToken(requestHeaders, token);
        const response = await fetch('http://localhost:8080/user', {
            method: 'GET',
            headers: requestHeaders
        });
        if (response.status === 200) {
            const json = await response.json();
            return new User(json.screenName, json.signInId, json.password);
        }
        return undefined;
    }
    
    // ユーザを作成する。
    public async create(user: User): Promise<boolean> {
        const json = this.getUserJSON(user);
        const requestHeaders = this.getHeaders(true, json.length);
        const response = await fetch('http://localhost:8080/user/create', {
            method: 'POST',
            headers: requestHeaders,
            body: json
        });
        return response.status === 200;
    }

    // サインアウトする。
    public async signout(token: string): Promise<boolean> {
        const requestHeaders = this.getHeaders();
        this.setToken(requestHeaders, token);
        const response = await fetch('http://localhost:8080/user/signout', {
            method: 'DELETE',
            headers: requestHeaders
        });
        return response.status === 200;
    }

    // JSONからユーザオブジェクトにパースし、返却する。
    private getUserJSON(user: User) : string {
        return JSON.stringify({
            password: user.password,
            screenName: user.screenName,
            signInId: user.signInId
        });
    }
}