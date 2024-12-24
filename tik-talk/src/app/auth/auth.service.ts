import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, tap, throwError} from "rxjs";
import {TokenResponse} from "./auth.interface";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    router = inject(Router)
    http = inject(HttpClient)
    cookieService = inject(CookieService)
    public baseApiUrl = `https://icherniakov.ru/yt-course/auth/`

    token: string | null = null;
    refreshToken: string | null = null;

    get isAuth(): boolean{
        if (!this.token){
            this.token = this.cookieService.get('token')
        }
        return !!this.token
    }

    constructor() {

    }

    login(payload: { username: string, password: string }) {
        const df = new FormData();

        df.append('username', payload.username);
        df.append('password', payload.password);


        console.log('username:', payload.username, 'pass:', payload.password)

        return this.http.post<TokenResponse>(`${this.baseApiUrl}token`, df).pipe(
            tap(val => this.saveTokens(val))
        )

    }

    refreshAuthToken(){
        return this.http.post<TokenResponse>(`${this.baseApiUrl}token`, {
            refresh_token: this.refreshToken,
        }).pipe(
            tap(res => this.saveTokens(res)),
            catchError(error => {
                this.logout();
                return throwError(error);
            })
        )
    }

    logout() {
        this.cookieService.deleteAll()
        this.token = null;
        this.refreshToken = null;
        this.router.navigate(['login']);
    }

    saveTokens(res: TokenResponse) {
        this.token = res.access_token;
        this.refreshToken = res.refresh_token;

        this.cookieService.set('token', this.token);
        this.cookieService.set('refreshToken', this.refreshToken);
    }
}
