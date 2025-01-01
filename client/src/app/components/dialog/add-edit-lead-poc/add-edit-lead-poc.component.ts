import { Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-lead-dialog',
  templateUrl: './add-edit-lead-poc.component.html',
  styleUrls: ['./add-edit-lead-poc.component.css']
})
export class AddEditLeadPocDialogComponent implements OnInit {
    @Output() dataSubmitted = new EventEmitter<any>();

    form!: FormGroup;
    constructor(private dialogRef: MatDialogRef<AddEditLeadPocDialogComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      console.log(this.data)
    }
    
    ngOnInit() {
        this.form = this.fb.group({
            name: [this.data?.poc_name || '', Validators.required],
            age: [this.data?.poc_age || '', [Validators.required, Validators.min(0), Validators.max(100)]],
            role: [this.data?.poc_role || '', Validators.required],
            gender: [this.data?.poc_gender || '', Validators.required],
            mobile: [this.data?.poc_mobile || null, Validators.minLength(10)],
            email: [this.data?.poc_email || '', Validators.email],
            from_date: [this.data?.poc_from || '', Validators.required],
            to_date: [this.data?.poc_to || null],
            isPresent: [this.data?.poc_to ? false : true]
        });

        if (this.form.get('isPresent'))
            this.form.get('to_date')?.disable()

        this.form.get('isPresent')?.valueChanges.subscribe((isPresent) => {
          if (isPresent) {
            this.form.get('to_date')?.disable();
          } else {
            this.form.get('to_date')?.enable();
          }
        });
    }

  onSubmit() {
    const pocData: any = {
      name: this.form.get('name')?.value,
      age: this.form.get('age')?.value,
      role: this.form.get('role')?.value,
      gender: this.form.get('gender')?.value,
      mobile: this.form.get('mobile')?.value,
      email: this.form.get('email')?.value,
      from_date: this.form.get('from_date')?.value,
      to_date: this.form.get('to_date')?.value
    };
    this.dataSubmitted.emit(pocData);
    this.onNoClick();
  }
    
  onNoClick(): void {
    this.dialogRef.close();
  }
}