import { Component } from '@angular/core';
import { INumberFilterParams, ITextFilterParams } from 'ag-grid-community';
import { performanceService } from 'src/app/services/performance.service';

@Component({
  selector: 'app-performance-metrics',
  templateUrl: './performance-metrics.component.html',
  styleUrl: './performance-metrics.component.css'
})
export class PerformanceComponent {
   columnDefs = [
        { 
            field: 'lead_name',
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
            field: 'avg_order_value',
            headerName: "Average Order Value", 
            filter: 'agNumberColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as INumberFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'order_count',
            headerName: "Order Count", 
            filter: 'agNumberColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as INumberFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'measured_time',
            headerName: "Time", 
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

    constructor(private performanceService: performanceService) {

    }

    ngOnInit() {
        this.getCallPlanner()
    }

    getCallPlanner() {
        this.performanceService.getPerformanceData().subscribe((res: any) => {
            this.rowData = res.data
        })
    }

}

