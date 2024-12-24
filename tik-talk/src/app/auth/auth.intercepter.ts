import {HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {catchError, switchMap, throwError} from "rxjs";

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    const token = authService.token
    if (!token) {
        return next(req)
    }

    return next(addToken(req, token)).pipe(
        catchError(error => {
            if (error.status === 403) {
                authService.logout()
            }

            return throwError(error);
        })
    )
}


function addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })
}