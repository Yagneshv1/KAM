import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class performanceService {
    private apiUrl = 'http://127.0.0.1:5000/api';
    
    constructor(
        private httpClient: HttpClient
    ) {}

    getPerformanceData() {
        return this.httpClient.get(`${this.apiUrl}/performance-metrics`)
    }

}