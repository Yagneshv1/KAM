import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InteractionsComponent } from './interactions.component';
import { InteractionService } from 'src/app/services/interaction.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AddInteractionDialogComponent } from '../dialog/addInteraction/addInteractionDialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('InteractionsComponent', () => {
    let component: InteractionsComponent;
    let fixture: ComponentFixture<InteractionsComponent>;
    let mockInteractionService: jasmine.SpyObj<InteractionService>;
    let dialog: MatDialog;

    beforeEach(async () => {
        mockInteractionService = jasmine.createSpyObj('InteractionService', ['getInteractionsData', 'addNewInteraction']);
        await TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, MatDialogModule],
        declarations: [InteractionsComponent],
        providers: [
            { provide: InteractionService, useValue: mockInteractionService },
            MatDialog,
        ],
        schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(InteractionsComponent);
        component = fixture.componentInstance;
        dialog = TestBed.inject(MatDialog);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should call getInteractionsData on init', () => {
        const mockResponse: any = { data: [{ lead_name: 'test1', interaction_time: '2025-01-01T00:00:00Z', interaction_mode: 'call' }] };
        mockInteractionService.getInteractionsData.and.returnValue(of(mockResponse));
        const getInteractionsDataSpy = spyOn(component, 'getInteractionsData').and.callThrough();
        component.ngOnInit();
        expect(getInteractionsDataSpy).toHaveBeenCalled();
    });

    it('should load interactions data when getInteractionsData is called', () => {
        const mockResponse: any = { data: [{ lead_name: 'test1', interaction_time: '2025-01-01T00:00:00Z', interaction_mode: 'call' }] };
        mockInteractionService.getInteractionsData.and.returnValue(of(mockResponse));
        component.getInteractionsData();
        fixture.detectChanges();

        expect(component.rowData).toEqual(mockResponse.data);
        expect(component.isLoading).toBeFalse();
    });
});
