import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class LeadService {
    private apiUrl = environment.baseUrl;
    
    constructor(
        private httpClient: HttpClient
    ) {}

    getLeadsData(compact: boolean = false) {
        let url = `${this.apiUrl}/leads`
        if (compact)
            url += `?compact=${compact}`
        return this.httpClient.get(url)
    }

    addNewLead(leadData: any) {
        return this.httpClient.post(`${this.apiUrl}/leads`, leadData)
    }

    updateLead(leadData: any) {
        return this.httpClient.put(`${this.apiUrl}/leads`, leadData)
    }
    getLeadPocData(leadId: string) {
        return this.httpClient.get(`${this.apiUrl}/lead/${leadId}/poc-info`)
    }

    addNewPoc(leadId: string, pocData: any) {
        return this.httpClient.post(`${this.apiUrl}/lead/${leadId}/poc-info`, pocData)
    }

    updateLeadPoc(leadId: string, pocData:any) {
        return this.httpClient.put(`${this.apiUrl}/lead/${leadId}/poc-info`, pocData)
    }
}