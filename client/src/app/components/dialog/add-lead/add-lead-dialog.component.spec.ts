import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddLeadDialogComponent } from './add-lead-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddLeadDialogComponent', () => {
  let component: AddLeadDialogComponent;
  let fixture: ComponentFixture<AddLeadDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<AddLeadDialogComponent>>;

  beforeEach(() => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, BrowserAnimationsModule],
      declarations: [AddLeadDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddLeadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form correctly', () => {
        expect(component.form).toBeTruthy();
        expect(component.form.get('name')).toBeTruthy();
        expect(component.form.get('address')).toBeTruthy();
        expect(component.form.get('city')).toBeTruthy();
        expect(component.form.get('state')).toBeTruthy();
        expect(component.form.get('pincode')).toBeTruthy();
        expect(component.form.get('email')).toBeTruthy();
        expect(component.form.get('mobile')).toBeTruthy();
        expect(component.form.get('website')).toBeTruthy();
        expect(component.form.get('domain')).toBeTruthy();
        expect(component.form.get('call_frequency')).toBeTruthy();
    });

    it('should call onSubmit and emit interaction data', () => {
        spyOn(component.dataSubmitted, 'emit');
        component.onSubmit();
        expect(component.dataSubmitted.emit).toHaveBeenCalled();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should call onNoClick and close the dialog', () => {
        component.onNoClick();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });
});
