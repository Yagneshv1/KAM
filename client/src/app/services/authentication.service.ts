import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private apiUrl = environment.baseUrl;
    
    public isUserLoggedIn = new BehaviorSubject<boolean>(false);

    constructor(
        private httpClient: HttpClient
    ) {}

    loginUser(username: string, password: string) {
        return this.httpClient.post(
            `${this.apiUrl}/login`,
            {'username': username, 'password': password}
        )
    }

    signUpUser(userDetails: any) {
        return this.httpClient.post(
            `${this.apiUrl}/signup`, userDetails
        )
    }

    invalidateToken() {
        localStorage.removeItem('auth_token')
    }

    // Store JWT token
    saveToken(token: string): void {
        localStorage.setItem('auth_token', token);
    }

    // Retrieve the token
    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    onUserLogin() {
        this.isUserLoggedIn.next(true)
    }
}