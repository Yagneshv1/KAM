import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddInteractionDialogComponent } from './addInteractionDialog.component';
import { ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { LeadService } from 'src/app/services/lead.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddInteractionDialogComponent', () => {
  let component: AddInteractionDialogComponent;
  let fixture: ComponentFixture<AddInteractionDialogComponent>;
  let mockLeadService: jasmine.SpyObj<LeadService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<AddInteractionDialogComponent>>;

  beforeEach(() => {
    mockLeadService = jasmine.createSpyObj('LeadService', ['getLeadsData']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, BrowserAnimationsModule],
      declarations: [AddInteractionDialogComponent],
      providers: [
        { provide: LeadService, useValue: mockLeadService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddInteractionDialogComponent);
    component = fixture.componentInstance;

    mockLeadService.getLeadsData.and.returnValue(of({ data: [{ lead_id: 1, lead_name: 'Lead 1', poc_name: 'POC 1', poc_id: 123 }] }));
    fixture.detectChanges();
  });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form correctly', () => {
        expect(component.form).toBeTruthy();
        expect(component.form.get('lead_id')).toBeTruthy();
        expect(component.form.get('time')).toBeTruthy();
        expect(component.form.get('mode')).toBeTruthy();
        expect(component.form.get('details')).toBeTruthy();
        expect(component.form.get('orders')).toBeTruthy();
        expect(component.form.get('poc')).toBeTruthy();
    });

    it('should populate lead data from the service', () => {
        expect(component.leadPocData.length).toBe(1);
        expect(component.leadsInfo.length).toBe(1);
        expect(component.leadsInfo[0].leadId).toBe(1);
    });

    it('should enable the poc field when a lead_id is selected', () => {
        component.form.get('lead_id')?.setValue(1);
        fixture.detectChanges();
        expect(component.form.get('poc')?.enabled).toBeTrue();
    });

    it('should disable the poc field when lead_id is null or empty', () => {
        component.form.get('lead_id')?.setValue(null);
        fixture.detectChanges();
        expect(component.form.get('poc')?.disabled).toBeTrue();
    });

    it('should call onSubmit and emit interaction data', () => {
        spyOn(component.dataSubmitted, 'emit');

        component.form.get('lead_id')?.setValue(1);
        component.form.get('time')?.setValue('2025-01-01T10:00');
        component.form.get('mode')?.setValue('Call');
        component.form.get('details')?.setValue('Initial call');
        component.form.get('poc')?.setValue(1);
        component.addOrder();
        (component.form.get('orders') as FormArray)?.at(0).get('order_details')?.setValue('Order 1');
        (component.form.get('orders') as FormArray)?.at(0).get('order_value')?.setValue(20);

        component.onSubmit();

        expect(component.dataSubmitted.emit).toHaveBeenCalledWith({
            lead_id: 1,
            interaction_time: jasmine.any(String),
            interaction_mode: 'Call',
            interaction_details: 'Initial call',
            poc_id: 1,
            orders: [{
                order_details: 'Order 1',
                order_value: 20
            }]
        });
        expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should add and remove orders from the FormArray', () => {
        expect(component.orders.length).toBe(0);

        component.addOrder();
        expect(component.orders.length).toBe(1);

        component.removeOrder(0);
        expect(component.orders.length).toBe(0);
    });

    it('should call onNoClick and close the dialog', () => {
        component.onNoClick();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });
});
