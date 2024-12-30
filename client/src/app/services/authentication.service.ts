import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private apiUrl = 'http://127.0.0.1:5000/api';
    
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

    // Store JWT token
    saveToken(token: string): void {
        localStorage.setItem('auth_token', token);
    }

    // Retrieve the token
    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }
}