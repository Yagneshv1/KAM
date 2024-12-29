import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LeadService } from 'src/app/services/lead.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { INumberFilterParams, ITextFilterParams } from 'ag-grid-community';
import { AddLeadPocDialogComponent } from '../../dialog/add-lead-poc/add-lead-poc.component';

@Component({
  selector: 'app-lead-poc',
  templateUrl: './lead-poc.component.html',
  styleUrl: './lead-poc.component.css'
})
export class LeadPocComponent {
   columnDefs = [
        { 
            field: 'poc_name',
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
            field: 'poc_age',
            headerName: "Age", 
            filter: 'agNumberColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as INumberFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'poc_gender',
            headerName: "Gender", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'poc_mobile',
            headerName: "Mobile", 
            filter: 'agNumberColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as INumberFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'poc_from',
            headerName: "From", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'poc_to',
            headerName: "To", 
            filter: 'agNumberColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as INumberFilterParams,
            minWidth: 210,
            wrapText:true,
        }
    ]

    rowData = []
    public leadId: string = '';

    constructor(private leadService: LeadService,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private router: Router
    ) {

    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.leadId = params['id']
        })
        this.getLeadPocData()
    }

    getLeadPocData() {
        this.leadService.getLeadPocData(this.leadId).subscribe((res: any) => {
            this.rowData = res.data
        })
    }

    onAddNewPoc() {
        const dialogConfig = new MatDialogConfig();
        const dialogRef = this.dialog.open(AddLeadPocDialogComponent, dialogConfig);
        dialogRef.componentInstance.dataSubmitted.subscribe((pocData: any)=>{
            this.leadService.addNewPoc(this.leadId, pocData).subscribe((res: any) => {
                this.getLeadPocData()
            })
        }) 
    }

}

