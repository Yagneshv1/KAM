import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddLeadPocDialogComponent } from './addEditLeadPoc.component';

describe('AddLeadPocDialogComponent', () => {
  let component: AddLeadPocDialogComponent;
  let fixture: ComponentFixture<AddLeadPocDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<AddLeadPocDialogComponent>>;

  beforeEach(() => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, BrowserAnimationsModule, MatCheckboxModule],
      declarations: [AddLeadPocDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddLeadPocDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form correctly', () => {
        expect(component.form).toBeTruthy();
        expect(component.form.get('name')).toBeTruthy();
        expect(component.form.get('age')).toBeTruthy();
        expect(component.form.get('role')).toBeTruthy();
        expect(component.form.get('gender')).toBeTruthy();
        expect(component.form.get('mobile')).toBeTruthy();
        expect(component.form.get('email')).toBeTruthy();
        expect(component.form.get('from_date')).toBeTruthy();
        expect(component.form.get('to_date')).toBeTruthy();
        expect(component.form.get('isPresent')).toBeTruthy();
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

    it('should enable the to_date field when a isPresent is not checked', () => {
        component.form.get('isPresent')?.setValue(false);
        fixture.detectChanges();
        expect(component.form.get('to_date')?.enabled).toBeTrue();
    });

    it('should disable the to_date field when isPresent is checked', () => {
        component.form.get('isPresent')?.setValue(true);
        fixture.detectChanges();
        expect(component.form.get('to_date')?.disabled).toBeTrue();
    });
});
