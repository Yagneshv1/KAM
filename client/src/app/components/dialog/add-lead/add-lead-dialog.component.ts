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

    form!: FormGroup;
    constructor(private dialogRef: MatDialogRef<AddLeadDialogComponent>,
        private fb: FormBuilder
    ) {

    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ['', Validators.required],
            status: ['', Validators.required],
            address: [''],
            city: [''],
            state: [''],
            pincode: [''],
            email: [''],
            website: [''],
            doamin: [''],
            call_frequency: [''],
            last_call: ['']
        });
    }


  onSubmit() {
    const leadData: any = {
      name: this.form.get('name')?.value,
      status: this.form.get('status')?.value,
      address: this.form.get('address')?.value,
      city: this.form.get('city')?.value,
      state: this.form.get('state')?.value,
      pincode: +this.form.get('pincode')?.value,
      email: this.form.get('email')?.value,
      website: this.form.get('website')?.value,
      domain: this.form.get('doamin')?.value,
      call_frequency: this.form.get('call_frequency')?.value
    };
    this.dataSubmitted.emit(leadData);
    this.onNoClick();
  }
    
  onNoClick(): void {
    this.dialogRef.close();
  }
}