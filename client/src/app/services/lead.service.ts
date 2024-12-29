import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LeadService {
    private apiUrl = 'http://127.0.0.1:5000/api';
    
    constructor(
        private httpClient: HttpClient
    ) {}

    getLeadsData() {
        const token = localStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.httpClient.get(`${this.apiUrl}/leads`, {headers})
    }

    addNewLead(leadData: any) {
        const token = localStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        
        return this.httpClient.post(`${this.apiUrl}/leads`, leadData, {headers})
    }

    getLeadPocData(leadId: string) {
        const token = localStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.httpClient.get(`${this.apiUrl}/lead/${leadId}/poc-info`, {headers})
    }

    addNewPoc(leadId: string, pocData: any) {
        const token = localStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        
        return this.httpClient.post(`${this.apiUrl}/lead/${leadId}/poc-info`, pocData, {headers})
    }
}