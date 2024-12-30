import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from "@angular/common/http";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const access_token = window.localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${access_token}`
        });

        const authRequest = req.clone({headers});
        return next.handle(authRequest);
    }
}