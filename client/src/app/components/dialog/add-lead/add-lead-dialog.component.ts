import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-lead-dialog',
  templateUrl: './add-lead-dialog.component.html',
  styleUrls: ['./add-lead-dialog.component.css']
})
export class AddLeadDialogComponent implements OnInit {
    @Output() dataSubmitted = new EventEmitter<any>();

    callFrequencies = ['Daily', 'Weekly', 'Bi-Weekly', 'Semi-Monthly', 'Monthly', 'Quarterly', 'Yearly']
    form!: FormGroup;
    constructor(private dialogRef: MatDialogRef<AddLeadDialogComponent>,
        private fb: FormBuilder
    ) {

    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            pincode: ['', [Validators.required, Validators.min(0)]],
            email: ['', [Validators.required, Validators.email]],
            mobile: ['', Validators.required],
            website: ['', Validators.pattern(/^https?:\/\/[^\s$.?#].[^\s]*$/i)],
            domain: [''],
            call_frequency: ['', Validators.required]
        });
    }

  onSubmit() {
    const leadData: any = {
      name: this.form.get('name')?.value,
      status: 'New',
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