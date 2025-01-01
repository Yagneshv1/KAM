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
            field: 'lead',
            headerName: "Lead Name", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            cellStyle: (params: any) => {
                if (params.data.performance) {
                    return {backgroundColor: 'lightgreen'};
                } else
                    return {backgroundColor: 'pink'};;
            },
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'order_value',
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
            field: 'count',
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
            field: 'performance_month',
            headerName: "Measured Month",
            valueGetter: (params: any) => {
                const month = new Date(params.data.performance_month).toLocaleString('en-US', {month: 'long'});
                const year = new Date(params.data.performance_month).getFullYear()
                return `${month} ${year}`
            },
            minWidth: 210,
            wrapText:true,
        }
    ]

    rowData = []
    public isLoading: boolean = false
    constructor(private performanceService: performanceService) {

    }

    ngOnInit() {
        this.getCallPlanner()
    }

    getCallPlanner() {
        this.isLoading = true
        this.performanceService.getPerformanceData().subscribe((res: any) => {
            this.isLoading = false
            this.rowData = res.data
        })
    }

}

