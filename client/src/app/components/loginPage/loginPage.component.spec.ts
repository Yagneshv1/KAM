import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './loginPage.component';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { SessionEndedDialogComponent } from '../dialog/sessionEndedDialog/sessionEndedDialog.component';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Test for LoginComponent
describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['loginUser', 'saveToken', 'onUserLogin', 'getToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [LoginComponent],
        providers: [
          { provide: AuthenticationService, useValue: authServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: MatDialog, useValue: dialogSpy },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate to signup page when onSignUp is called', () => {
      component.onSignUp();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/signup']);
    });
});
