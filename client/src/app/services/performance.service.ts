import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class performanceService {
    private apiUrl = environment.baseUrl;
    
    constructor(
        private httpClient: HttpClient
    ) {}

    getPerformanceData() {
        return this.httpClient.get(`${this.apiUrl}/performance-metrics`)
    }

}