import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { LeadService } from 'src/app/services/lead.service';
import { LeadPocComponent } from '../../lead-management/lead-poc/lead-poc.component';
import { AddEditLeadPocDialogComponent } from '../add-edit-lead-poc/add-edit-lead-poc.component';

@Component({
  selector: 'app-edit-lead',
  template: `<button mat-raised-button color="primary" (click)="onClickEditPoc()">Edit POC</button> `,
})
export class EditLeadPocRendererComponent implements ICellRendererAngularComp {
    constructor(private dialog: MatDialog,
      private leadService: LeadService,
      private leadPocManagementComponent: LeadPocComponent
    ) {

    }

    params: any;

    agInit(params: any): void {
      this.params = params;
    }

    refresh(params: any): boolean {
      return false;
    }

    onClickEditPoc() {
        const dialogRef = this.dialog.open(AddEditLeadPocDialogComponent, {data: this.params.data});
        dialogRef.componentInstance.dataSubmitted.subscribe((pocData: any)=>{
          pocData.poc_id = this.params.data.poc_id
          this.leadService.updateLeadPoc(this.params.data.lead_id, pocData).subscribe(res => {
            this.leadPocManagementComponent.getLeadPocData()
          })
        })  
    }
}