import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

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
        private datePipe: DatePipe
    ) {

    }

    ngOnInit() {
        this.form = this.fb.group({
            lead_id: ['', Validators.required],
            time: ['', Validators.required],
            mode: [''],
            details: [''],
            poc: [''],
            orders: new FormArray([])
        });
    }

    get orders() {
        return (this.form.get('orders') as FormArray);
    }
    
    addOrder() {
        const orderGroup = this.fb.group({
            order_details: ['', Validators.required],
            order_value: ['', [Validators.required, Validators.min(1)]]
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