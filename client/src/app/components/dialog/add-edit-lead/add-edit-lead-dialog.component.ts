import { Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-lead-dialog',
  templateUrl: './add-edit-lead-dialog.component.html',
  styleUrls: ['./add-edit-lead-dialog.component.css']
})
export class AddEditLeadDialogComponent implements OnInit {
    @Output() dataSubmitted = new EventEmitter<any>();

    callFrequencies = ['Daily', 'Weekly', 'Bi-Weekly', 'Semi-Monthly', 'Monthly', 'Quarterly', 'Yearly']
    form!: FormGroup;
    constructor(private dialogRef: MatDialogRef<AddEditLeadDialogComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: [this.data?.lead_name || '', Validators.required],
            address: [this.data?.lead_address|| '', Validators.required],
            city: [this.data?.lead_city || '', Validators.required],
            state: [this.data?.lead_state || '', Validators.required],
            pincode: [this.data?.lead_pincode || '', [Validators.required, Validators.min(0)]],
            email: [this.data?.email || '', [Validators.required, Validators.email]],
            mobile: [this.data?.mobile || '', Validators.required],
            website: [this.data?.website || '', Validators.pattern(/^https?:\/\/[^\s$.?#].[^\s]*$/i)],
            domain: [this.data?.domain || ''],
            call_frequency: [this.data?.call_frequency || '', Validators.required]
        });
    }

  onSubmit() {
    const leadData: any = {
      name: this.form.get('name')?.value,
      address: this.form.get('address')?.value,
      city: this.form.get('city')?.value,
      state: this.form.get('state')?.value,
      pincode: +this.form.get('pincode')?.value,
      email: this.form.get('email')?.value,
      mobile: this.form.get('mobile')?.value,
      website: this.form.get('website')?.value,
      domain: this.form.get('domain')?.value,
      call_frequency: this.form.get('call_frequency')?.value
    };
    this.dataSubmitted.emit(leadData);
    this.onNoClick();
  }
    
  onNoClick(): void {
    this.dialogRef.close();
  }
}