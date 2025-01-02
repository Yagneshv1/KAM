import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class InteractionService {
    private apiUrl = environment.baseUrl;
    
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