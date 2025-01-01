import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SignUpComponent', () => {
    let component: SignUpComponent;
    let fixture: ComponentFixture<SignUpComponent>;
    let mockAuthService: jasmine.SpyObj<AuthenticationService>;
    let mockRouter: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        mockAuthService = jasmine.createSpyObj('AuthenticationService', ['signUpUser']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, HttpClientTestingModule],
        declarations: [SignUpComponent],
        providers: [
            { provide: AuthenticationService, useValue: mockAuthService },
            { provide: Router, useValue: mockRouter },
            FormBuilder
        ],
        schemas: [NO_ERRORS_SCHEMA], // Skip unknown components
        }).compileComponents();

        fixture = TestBed.createComponent(SignUpComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with the controls', () => {
        expect(component.form.contains('username')).toBeTrue();
        expect(component.form.contains('password')).toBeTrue();
        expect(component.form.contains('name')).toBeTrue();
        expect(component.form.contains('role')).toBeTrue();
        expect(component.form.contains('dob')).toBeTrue();
        expect(component.form.contains('mobile')).toBeTrue();
        expect(component.form.contains('email')).toBeTrue();
    });

    it('should call onSignUp when the user clicks sign up', () => {
        mockAuthService.signUpUser.and.returnValue(of({}));
        component.onSignUp();
        expect(mockAuthService.signUpUser).toHaveBeenCalled();
        expect(component.loginMessage).toBe('User registered successfully! Continue to login page.');
    });

    it('should handle sign up failure and show error message', () => {
        mockAuthService.signUpUser.and.returnValue(throwError('Error'));
        component.onSignUp();
        expect(mockAuthService.signUpUser).toHaveBeenCalled();
        expect(component.loginMessage).toBe('Failed to register user.');
    });

    it('should navigate to login page when onLoginUser is called', () => {
        component.onLoginUser();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
});
