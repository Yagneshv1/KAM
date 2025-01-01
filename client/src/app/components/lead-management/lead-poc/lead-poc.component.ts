import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LeadService } from 'src/app/services/lead.service';
import { ActivatedRoute, Params } from '@angular/router';
import { INumberFilterParams, ITextFilterParams } from 'ag-grid-community';
import { AddEditLeadPocDialogComponent } from '../../dialog/add-edit-lead-poc/add-edit-lead-poc.component';
import { IDateFilterParams } from 'ag-grid-enterprise';
import { EditLeadPocRendererComponent } from '../../dialog/edit-poc/edit-poc.component';

@Component({
  selector: 'app-lead-poc',
  templateUrl: './lead-poc.component.html',
  styleUrl: './lead-poc.component.css'
})
export class LeadPocComponent {
   columnDefs = [
        {
            headerName: '',
            cellRenderer: EditLeadPocRendererComponent,
            minWidth: 100
        },
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
            field: 'poc_role',
            headerName: "Role", 
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
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'poc_email',
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
            field: 'poc_from',
            headerName: "From", 
            filter: 'agDateColumnFilter',
            minWidth: 210,
            wrapText:true,
            filterParams: {
                filterOptions: ['lessThan', 'greaterThan', 'inRange' ],
                closeOnApply: true,
            } as IDateFilterParams,
            valueGetter: (params: any) => {
                const utcDateString = params.data.poc_from;
                const localDate = new Date(utcDateString)
                return localDate;
            },
            valueFormatter: (params: any) => {
                return params.value ? params.value.toLocaleDateString() : '';
            }
        },
        { 
            field: 'poc_to',
            headerName: "To", 
            filter: 'agDateColumnFilter',
            minWidth: 210,
            wrapText:true,
            filterParams: {
                filterOptions: ['lessThan', 'greaterThan', 'inRange' ],
                closeOnApply: true,
            } as IDateFilterParams,
            valueGetter: (params: any) => {
                const utcDateString = params.data.poc_to;
                return utcDateString ? new Date(utcDateString) : new Date()
            },
            valueFormatter: (params: any) => {
                return params.value ? (params.value.getTime() == new Date().getTime() ? 'Present' : params.value.toLocaleDateString()) : '';
            }
        }
    ]

    rowData = []
    public leadId: string = '';
    public isLoading: boolean = false;

    constructor(private leadService: LeadService,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog
    ) {

    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.leadId = params['id']
        })
        this.getLeadPocData()
    }

    getLeadPocData() {
        this.isLoading = true;
        this.leadService.getLeadPocData(this.leadId).subscribe((res: any) => {
            this.rowData = res.data
            this.isLoading = false;
        },
        (error) => {
            this.isLoading = false;
            this.rowData = []
        })
    }

    onAddNewPoc() {
        const dialogConfig = new MatDialogConfig();
        const dialogRef = this.dialog.open(AddEditLeadPocDialogComponent, dialogConfig);
        dialogRef.componentInstance.dataSubmitted.subscribe((pocData: any)=>{
            this.isLoading = true;
            this.leadService.addNewPoc(this.leadId, pocData).subscribe((res: any) => {
                this.isLoading = false
                this.getLeadPocData()
            },
            (error) => {
                this.isLoading = false
            })
        }) 
    }

}

