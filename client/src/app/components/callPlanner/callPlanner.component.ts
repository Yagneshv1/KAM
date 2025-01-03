import { Component } from '@angular/core';
import { ITextFilterParams } from 'ag-grid-community';
import { callPlannerService } from 'src/app/services/callPlanner.service';

@Component({
  selector: 'app-call-planner',
  templateUrl: './callPlanner.component.html',
  styleUrl: './callPlanner.component.css'
})
export class CallPlannerComponent {
   columnDefs = [
        { 
            field: 'leadname',
            headerName: "Lead Name", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'leademail',
            headerName: "Lead Email", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'leadmobile',
            headerName: "Lead Mobile", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'pocname',
            headerName: "POC Name", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'pocemail',
            headerName: "POC Email", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'pocmobile',
            headerName: "POC Mobile", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        }
    ]

    rowData = []
    public isLoading: boolean = false;

    constructor(private callPlannerService: callPlannerService) {

    }

    ngOnInit() {
        this.getCallPlanner()
    }

    // Gets the details of leads requiring call today.
    getCallPlanner() {
        this.isLoading = true
        this.callPlannerService.getCallPlanner().subscribe((res: any) => {
            this.isLoading = false
            this.rowData = res.data
        },
        (error) => {
            this.isLoading = false
            this.rowData = []
        })
    }

}

