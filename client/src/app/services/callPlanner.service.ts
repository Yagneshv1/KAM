import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class callPlannerService {
    private apiUrl = environment.baseUrl;
    
    constructor(
        private httpClient: HttpClient
    ) {}

    getCallPlanner() {
        return this.httpClient.get(`${this.apiUrl}/call-planner`)
    }
}