import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { AddEditLeadDialogComponent } from '../addEditLead/addEditLeadDialog.component';
import { LeadService } from 'src/app/services/lead.service';
import { LeadManagementComponent } from '../../leadManagement/leadManagement.component';
@Component({
  selector: 'app-edit-lead',
  template: `<button mat-raised-button color="primary" (click)="onClickEditLead()">Edit</button> `,
})
export class EditLeadRendererComponent implements ICellRendererAngularComp {
    constructor(private dialog: MatDialog,
      private leadService: LeadService,
      private leadManagementComponent: LeadManagementComponent
    ) {

    }

    params: any;

    agInit(params: any): void {
      this.params = params;
    }

    refresh(params: any): boolean {
      return false;
    }

    onClickEditLead() {
        const dialogRef = this.dialog.open(AddEditLeadDialogComponent, {data: this.params.data});
        dialogRef.componentInstance.dataSubmitted.subscribe((leadData: any)=>{
          leadData.lead_id = this.params.data.lead_id
          this.leadService.updateLead(leadData).subscribe(res => {
            this.leadManagementComponent.getLeadsData()
          })
        })  
    }
}