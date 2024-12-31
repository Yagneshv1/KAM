import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-lead-dialog',
  templateUrl: './add-lead-poc.component.html',
  styleUrls: ['./add-lead-poc.component.css']
})
export class AddLeadPocDialogComponent implements OnInit {
    @Output() dataSubmitted = new EventEmitter<any>();

    form!: FormGroup;
    constructor(private dialogRef: MatDialogRef<AddLeadPocDialogComponent>,
        private fb: FormBuilder
    ) {

    }
    
    ngOnInit() {
        this.form = this.fb.group({
            name: ['', Validators.required],
            age: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
            role: ['', Validators.required],
            gender: ['', Validators.required],
            mobile: ['', Validators.minLength(10)],
            email: ['', Validators.email],
            from_date: ['', Validators.required],
            to_date: [''],
            isPresent: ['']
        });

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