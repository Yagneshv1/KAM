import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerformanceComponent } from './performance-metrics.component';
import { performanceService } from 'src/app/services/performance.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PerformanceComponent', () => {
    let component: PerformanceComponent;
    let fixture: ComponentFixture<PerformanceComponent>;
    let mockPerformanceService: jasmine.SpyObj<performanceService>;

    beforeEach(async () => {
        mockPerformanceService = jasmine.createSpyObj('performanceService', ['getPerformanceData']);

        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [PerformanceComponent],
            providers: [
                { provide: performanceService, useValue: mockPerformanceService },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(PerformanceComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should call getCallPlanner on init', () => {
        const mockResponse: any = { data: [{ lead: 'test1', order_value: 100, count: 1, performance_month: '2024-01-01' }] };
        mockPerformanceService.getPerformanceData.and.returnValue(of(mockResponse));
        const getCallPlannerSpy = spyOn(component, 'getCallPlanner').and.callThrough();
        component.ngOnInit();
        expect(getCallPlannerSpy).toHaveBeenCalled();
    });

    it('should fetch performance data when getCallPlanner is called', () => {
        const mockResponse: any = { data: [{ lead: 'test1', order_value: 100, count: 1, performance_month: '2024-01-01' }] };
        mockPerformanceService.getPerformanceData.and.returnValue(of(mockResponse));
        component.getCallPlanner();
        fixture.detectChanges();
        expect(component.rowData).toEqual(mockResponse.data);
    });

    it('should format performance month correctly', () => {
        const mockData = { performance_month: '2024-01-01' };
        const formattedMonth = component.columnDefs[3].valueGetter!({ data: mockData });
        expect(formattedMonth).toBe('January 2024');
    });
});
