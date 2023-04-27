import { UserRepository } from '../../infrastructure/api/userRepository';
import { useSignInUserStore } from '../stores/authorizations/signInUser';
import type { User } from '../../domain/models/user';
import { BackupUC } from './backupUC';
import { useBackupsStore } from '../stores/backups';

export class UserUC {
    readonly repos = new UserRepository();

    public async signIn(signInId: string, password: string): Promise<User | undefined> {
        const token = await this.repos.auth(signInId, password);
        if (token === "") {
            return undefined;
        }
        const store = useSignInUserStore();
        store.setToken(token);
        const user = await this.repos.get(token);
        if (user === undefined) {
            return undefined;
        }
        store.setUser(user);
        const backupUC = new BackupUC();
        backupUC.update();
        return user;
    }

    public async modify(user : User): Promise<boolean> {
        const store = useSignInUserStore();
        const token = store.token;
        if (token === undefined) {
            return false;
        }
        const oldUser = store.getUser;
        if (oldUser === undefined) {
            return false;
        }
        return await this.repos.modify(user, token);
    }

    public async leave(): Promise<boolean> {
        const store = useSignInUserStore();
        const token = store.token;
        if (token === undefined) {
            return false;
        }
        const user = store.getUser;
        if (user === undefined) {
            return false;
        }
        this.signOut();
        return await this.repos.leave(user, token);
    }

    public async get(): Promise<User|undefined> {
        const store = useSignInUserStore();
        const token = store.token;
        if (token === undefined) {
            return undefined;
        }
        return await this.repos.get(token);
    }

    public async create(user: User): Promise<void> {
        const ok = await this.repos.create(user);
        if (ok){
            this.signIn(user.signInId, user.password);
        }
    }

    public signOut(): void {
        const userStore = useSignInUserStore();
        const token = userStore.getToken;
        if (token === undefined) {
            return;
        }
        this.repos.signout(token);
        userStore.signOut();
        const backupStore = useBackupsStore();
        backupStore.set([]);
    }
}