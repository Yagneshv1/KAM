import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LeadService } from 'src/app/services/lead.service';

@Component({
  selector: 'app-add-interaction-dialog',
  templateUrl: './add-interaction-dialog.component.html',
  styleUrls: ['./add-interaction-dialog.component.css'],
  providers: [DatePipe]
})
export class AddInteractionDialogComponent implements OnInit {
    @Output() dataSubmitted = new EventEmitter<any>();

    form!: FormGroup;
    constructor(private dialogRef: MatDialogRef<AddInteractionDialogComponent>,
        private fb: FormBuilder,
        private leadService: LeadService,
        private datePipe: DatePipe
    ) {

    }

    leadPocData: any = []
    leadsInfo: any = []
    pocInfo: any = []

    ngOnInit() {
        this.form = this.fb.group({
            lead_id: ['', Validators.required],
            time: [this.getCurrentDateTime(), Validators.required],
            mode: ['', Validators.required],
            details: [''],
            poc: [{ value: '', disabled: true }, Validators.required],
            orders: new FormArray([])
        });

        this.leadService.getLeadsData(true).subscribe((res: any) => {
          this.leadPocData = res.data
          this.leadPocData.map((lead: any) => {
            this.leadsInfo.push({leadId: lead.lead_id, leadName: lead.lead_name})
          })
        })

        this.form.get('lead_id')?.valueChanges.subscribe((leadId) => {
          if (leadId) {
            this.form.get('poc')?.enable();
          } else {
            this.form.get('poc')?.disable();
          }
        });
    }

    onLeadChange() {
      const leadId = this.form.get('lead_id')?.value
      this.leadPocData.map((lead: any) => {
        if (lead.lead_id == leadId) 
          this.pocInfo.push({pocName: lead.poc_name, pocId: lead.poc_id})
      })
    }

    getCurrentDateTime() {
      const formattedDate = new Date().toLocaleString()
      const [day, month, year, hour, minute] = formattedDate.split(/[\s,\/:]+/);
      const localDateTimeString = `${year}-${month}-${day}T${hour}:${minute}`;
      return localDateTimeString;
    }

    get orders() {
        return (this.form.get('orders') as FormArray);
    }
    
    addOrder() {
        const orderGroup = this.fb.group({
            order_details: ['', Validators.required],
            order_value: ['', [Validators.required, Validators.min(0.01), Validators.maxLength(4)]]
        });
        this.orders.push(orderGroup);
    }

    removeOrder(index: number) {
        this.orders.removeAt(index);
    }

  onSubmit() {
    const interactionData: any = {
      lead_id: this.form.get('lead_id')?.value,
      interaction_time: this.datePipe.transform(new Date(this.form.get('time')?.value).toISOString(), 'yyyy-MM-dd HH:mm:ss', 'UTC'),
      interaction_mode: this.form.get('mode')?.value,
      interaction_details: this.form.get('details')?.value,
      poc_id: this.form.get('poc')?.value,
      orders: this.form.get('orders')?.value
    };
    this.dataSubmitted.emit(interactionData);
    this.onNoClick();
  }
    
  onNoClick(): void {
    this.dialogRef.close();
  }
}