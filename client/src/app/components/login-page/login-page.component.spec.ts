import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login-page.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

describe('LoginPageComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, CommonModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
