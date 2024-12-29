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
            age: ['', Validators.required],
            gender: [''],
            mobile: [''],
            email: [''],
            from_date: [''],
            to_date: ['']
        });
    }

  onSubmit() {
    const pocData: any = {
      name: this.form.get('name')?.value,
      age: this.form.get('age')?.value,
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