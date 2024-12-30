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
        return this.httpClient.get(`${this.apiUrl}/interactions`)
    }

    addNewInteraction(interactionData: any) {
        return this.httpClient.post(`${this.apiUrl}/interactions`, interactionData)
    }
}