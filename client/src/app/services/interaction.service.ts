import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class InteractionService {
    private apiUrl = 'http://127.0.0.1:5000/api';
    
    constructor(
        private httpClient: HttpClient
    ) {}

    getInteractionsData() {
        const token = localStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.httpClient.get(`${this.apiUrl}/interactions`, {headers})
    }

    addNewInteraction(interactionData: any) {
        const token = localStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.httpClient.post(`${this.apiUrl}/interactions`, interactionData, {headers})
    }
}