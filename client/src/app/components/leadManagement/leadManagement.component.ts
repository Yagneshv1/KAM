import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { INumberFilterParams, ITextFilterParams } from 'ag-grid-community';
import { LeadService } from 'src/app/services/lead.service';
import { AddEditLeadDialogComponent } from '../dialog/addEditLead/addEditLeadDialog.component';
import { Router } from '@angular/router';
import { EditLeadRendererComponent } from '../dialog/editLead/editLead.component';

@Component({
  selector: 'app-lead-manager',
  templateUrl: './leadManagement.component.html',
  styleUrl: './leadManagement.component.css'
})
export class LeadManagementComponent {
    columnDefs = [
        {
            field: 'edit',
            headerName: '',
            cellRenderer: EditLeadRendererComponent,
            minWidth: 100
        },
        { 
            field: 'lead_name',
            headerName: "Name", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            cellStyle: {color: '#3366CC',cursor:"pointer"},
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'lead_status',
            headerName: "Status", 
            filter: true,
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
            field: 'mobile',
            headerName: "Mobile", 
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
            cellStyle: {color: '#3366CC',cursor:"pointer"},
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
    isLoading: boolean = false;
    
    constructor(private leadService: LeadService,
        private dialog: MatDialog,
        private router: Router
    ) {

    }

    ngOnInit() {
        this.getLeadsData()
    }

    getLeadsData() {
        this.isLoading = true
        this.leadService.getLeadsData().subscribe((res: any) => {
            this.rowData = res.data
            this.isLoading = false
        },
        (error) => {
            this.isLoading = false;
            this.rowData = []
        })
    }

    OnAddNewLead() {
        const dialogConfig = new MatDialogConfig();
        const dialogRef = this.dialog.open(AddEditLeadDialogComponent, dialogConfig);
        dialogRef.componentInstance.dataSubmitted.subscribe((leadData: any)=>{
            this.isLoading = true;
            this.leadService.addNewLead(leadData).subscribe((res: any) => {
                this.isLoading = false;
                this.getLeadsData()
            },
            (error) => {
                this.isLoading = false
            })
        })  
    }

    onNodeClicked(clickData: any) {
        if (clickData.headerName == 'Name') {
            this.router.navigate(['leads', clickData.rowData.lead_id, 'summary'])
        } else if(clickData.headerName == 'Website') {
            window.open(clickData.rowData.website, '_blank')
        }
    }
}

