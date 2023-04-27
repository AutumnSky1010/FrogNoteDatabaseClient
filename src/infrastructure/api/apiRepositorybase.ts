export abstract class APIRepositoryBase {
    // 汎用的なCORSに対応したリクエストヘッダを取得する。isJsonはJsonを送信する場合にtrueを与えて用いる。
    protected getHeaders(isJson: boolean = false, contentLength : number = 0) : Headers {
        const requestHeaders = new Headers();
        if (isJson){
            requestHeaders.append('Content-Type', 'application/json');
        }
        const originUri = 'http://localhost:5173';
        requestHeaders.append('Origin', originUri);
        requestHeaders.append('Content-Length', contentLength.toString());
        return requestHeaders;
    }    

    protected setToken(header: Headers, token: string) : void {
        header.append('Authorization', token);
    }
}