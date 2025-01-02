import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionEndedDialogComponent } from './sessionEndedDialog.component';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


describe('SessionEndedDialogComponent', () => {
    let component: SessionEndedDialogComponent;
    let fixture: ComponentFixture<SessionEndedDialogComponent>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockDialogRef: jasmine.SpyObj<MatDialogRef<SessionEndedDialogComponent>>;

    beforeEach(() => {
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close'], { disableClose: true });

        TestBed.configureTestingModule({
            declarations: [SessionEndedDialogComponent],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: MatDialogRef, useValue: mockDialogRef }
            ],
            imports: [MatIconModule, MatDialogModule, CommonModule]
        }).compileComponents();

        fixture = TestBed.createComponent(SessionEndedDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should set dialogRef.disableClose to true', () => {
        expect(mockDialogRef.disableClose).toBeTrue();
    });
});
