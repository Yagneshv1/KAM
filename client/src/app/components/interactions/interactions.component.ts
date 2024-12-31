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
            field: 'interaction_time',
            headerName: "Interaction Time", 
            filter: 'agDateColumnFilter',
            valueGetter: (params: any) => {
                const utcDateString = params.data.interaction_time;
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
            field: 'interaction_mode',
            headerName: "Interaction Mode", 
            filter: true,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'interaction_details',
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
            field: 'poc_name',
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
            field: 'order_details',
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
            field: 'order_value',
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
            field: 'order_id',
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

    constructor(private interactionService: InteractionService,
        private dialog: MatDialog
    ) {

    }

    ngOnInit() {
        this.getInteractionsData()
    }

    getInteractionsData() {
        this.interactionService.getInteractionsData().subscribe((res: any) => {
            this.rowData = res.data
        })
    }

    onAddInteraction() {
        const dialogConfig = new MatDialogConfig();
        const dialogRef = this.dialog.open(AddInteractionDialogComponent, dialogConfig);
        dialogRef.componentInstance.dataSubmitted.subscribe((interactionData: any)=>{
            this.interactionService.addNewInteraction(interactionData).subscribe((res: any) => {
                this.getInteractionsData()
            })
        }) 
    }

}

