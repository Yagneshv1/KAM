import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LeadService } from 'src/app/services/lead.service';
import { ActivatedRoute, Router } from '@angular/router';
import { INumberFilterParams, ITextFilterParams } from 'ag-grid-community';
import { InteractionService } from 'src/app/services/interaction.service';
import { AddInteractionDialogComponent } from '../dialog/add-interaction/add-interaction-dialog.component';

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
            filter: 'agNumberColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
            minWidth: 210,
            wrapText:true,
        },
        { 
            field: 'interaction_mode',
            headerName: "Mode", 
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
                closeOnApply: true,
            } as ITextFilterParams,
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
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private router: Router
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

