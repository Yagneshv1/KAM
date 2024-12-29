import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { INumberFilterParams, ITextFilterParams } from 'ag-grid-community';
import { LeadService } from 'src/app/services/lead.service';
import { AddLeadDialogComponent } from '../dialog/add-lead/add-lead-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lead-manager',
  templateUrl: './lead-management.component.html',
  styleUrl: './lead-management.component.css'
})
export class LeadManagementComponent {
    columnDefs = [
        { 
            field: 'lead_name',
            headerName: "Name", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'lead_status',
            headerName: "Status", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'lead_address',
            headerName: "Address", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'lead_city',
            headerName: "City", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'lead_state',
            headerName: "State", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'lead_pincode',
            headerName: "Pincode", 
            filter: 'agNumberColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as INumberFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'email',
            headerName: "Email", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'website',
            headerName: "Website", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'lead_domain',
            headerName: "Domain", 
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

    constructor(private leadService: LeadService,
        private dialog: MatDialog,
        private router: Router
    ) {

    }

    ngOnInit() {
        this.getLeadsData()
    }

    getLeadsData() {
        this.leadService.getLeadsData().subscribe((res: any) => {
            this.rowData = res.data
        })
    }

    OnAddNewLead() {
        const dialogConfig = new MatDialogConfig();
        const dialogRef = this.dialog.open(AddLeadDialogComponent, dialogConfig);
        dialogRef.componentInstance.dataSubmitted.subscribe((leadData: any)=>{
            this.leadService.addNewLead(leadData).subscribe((res: any) => {
                this.getLeadsData()
            })
        })  
    }

    onNodeClicked(clickData: any) {
        console.log(clickData)
        if (clickData.headerName == 'Name') {
            this.router.navigate(['leads', clickData.rowData.lead_id, 'summary'])
        }
    }
}

