import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { INumberFilterParams, ITextFilterParams } from 'ag-grid-community';
import { InteractionService } from 'src/app/services/interaction.service';
import { AddInteractionDialogComponent } from '../dialog/add-interaction/add-interaction-dialog.component';
import { IDateFilterParams } from 'ag-grid-enterprise';

@Component({
  selector: 'app-interactions',
  templateUrl: './interactions.component.html',
  styleUrl: './interactions.component.css'
})
export class InteractionsComponent {
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
            field: 'interactiontime',
            headerName: "Interaction Time", 
            filter: 'agDateColumnFilter',
            valueGetter: (params: any) => {
                const utcDateString = params.data.interactiontime;
                const localDate = new Date(utcDateString)
                return localDate;
            },
            valueFormatter: (params: any) => {
                return params.value ? params.value.toLocaleString() : '';
            },
            filterParams: {
                filterOptions: ['lessThan', 'greaterThan', 'inRange' ],
                closeOnApply: true,
            } as IDateFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'interactionmode',
            headerName: "Interaction Mode", 
            filter: true,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'interactiondetails',
            headerName: "Details", 
            filter: 'agNumberColumnFilter',
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
            field: 'orderdetails',
            headerName: "Order Details",
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'ordervalue',
            headerName: "Order Value",
            filter: 'agNumberColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as INumberFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'orderid',
            headerName: "Order ID",
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
    public isLoading: boolean = false;
    
    constructor(private interactionService: InteractionService,
        private dialog: MatDialog
    ) {

    }

    ngOnInit() {
        this.getInteractionsData()
    }

    getInteractionsData() {
        this.isLoading = true
        this.interactionService.getInteractionsData().subscribe((res: any) => {
            this.rowData = res.data
            this.isLoading = false;
        })
    }

    onAddInteraction() {
        const dialogConfig = new MatDialogConfig();
        const dialogRef = this.dialog.open(AddInteractionDialogComponent, dialogConfig);
        dialogRef.componentInstance.dataSubmitted.subscribe((interactionData: any)=>{
            this.isLoading = true
            this.interactionService.addNewInteraction(interactionData).subscribe((res: any) => {
                this.isLoading = false
                this.getInteractionsData()
            })
        }) 
    }

}

