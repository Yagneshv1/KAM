import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginMessage: string = '';

  constructor(private authService: AuthenticationService,
    private router: Router
  ) {

  }

  onLoginUser() {
    this.authService.loginUser(this.username, this.password).subscribe((response: any) => {
      this.authService.saveToken(response.access_token)
      this.loginMessage = 'Login Successful! Redirecting to home page'
      setTimeout(() => {
        this.router.navigate(['/home'])
      }, 5000)
    }, (err) => {
      this.loginMessage = err.error.message
    })
  }

  onSignUp(){
    this.router.navigate(['/signup'])
  }
}