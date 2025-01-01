import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallPlannerComponent } from './call-planner.component';
import { of } from 'rxjs';
import { callPlannerService } from 'src/app/services/call-planner.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CallPlannerComponent', () => {
    let component: CallPlannerComponent;
    let fixture: ComponentFixture<CallPlannerComponent>;
    let mockCallPlannerService: jasmine.SpyObj<callPlannerService>;

    beforeEach(() => {
        mockCallPlannerService = jasmine.createSpyObj('callPlannerService', ['getCallPlanner']);
        
        TestBed.configureTestingModule({
        declarations: [ CallPlannerComponent ],
        providers: [
            { provide: callPlannerService, useValue: mockCallPlannerService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();

        fixture = TestBed.createComponent(CallPlannerComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should call getCallPlanner on init', () => {
        const mockResponse: any = { data: [{ leadname: 'Test1', leademail: 'test@test.com' }] };
        mockCallPlannerService.getCallPlanner.and.returnValue(of(mockResponse));

        component.ngOnInit();
        expect(mockCallPlannerService.getCallPlanner).toHaveBeenCalled();
        expect(component.rowData).toEqual(mockResponse.data);
        expect(component.isLoading).toBeFalse();
    });

    it('should handle error response', () => {
        mockCallPlannerService.getCallPlanner.and.returnValue(of({ error: 'Test error' }));
        component.ngOnInit();
        expect(component.isLoading).toBeFalse();
    });
});
