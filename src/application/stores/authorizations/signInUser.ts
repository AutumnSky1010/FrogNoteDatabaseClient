import { defineStore } from 'pinia';
import { User } from '../../../domain/models/user';

// サインインしているユーザに関する情報を表すインタフェース。
export interface SignInUserState {
    user?: User;
    token?: string;
}

// サインインしているユーザに関する状態をもつストア。
export const useSignInUserStore = defineStore({
    id: 'user',
    state: (): SignInUserState => {
        return { user: new User('', '', ''), token: "" };
    },
    getters: {
        getUser: (state): User | undefined => {
            return state.user;
        },
        getToken: (state): string | undefined => {
            return state.token;
        }
    },
    actions: {
        setUser(user: User): void {
            this.user = user;
        },
        setToken(token: string): void {
            this.token = token;
        },
        signOut(): void {
            this.token = undefined;
            this.user = undefined;
        }
    }
});