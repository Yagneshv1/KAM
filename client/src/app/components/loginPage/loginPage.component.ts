import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { jwtDecode } from 'jwt-decode';
import { MatDialog } from '@angular/material/dialog';
import { SessionEndedDialogComponent } from '../dialog/sessionEndedDialog/sessionEndedDialog.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './loginPage.component.html',
  styleUrl: './loginPage.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginMessage: string = '';

  constructor(private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog
  ) {

  }

  isLoading = false;

  onLoginUser() {
    this.isLoading = true
    this.authService.loginUser(this.username, this.password).subscribe((response: any) => {
      this.authService.saveToken(response.access_token)
      this.authService.onUserLogin()

      const timeLeftToExpire = this.getTimeLeftBeforeExpiration(response.access_token)
      setTimeout(()=>{
        if (this.authService.getToken())
          this.openSessionEndedDialog()
      }, timeLeftToExpire)
      
      this.loginMessage = 'Login Successful! Redirecting to home page...'
      setTimeout(() => {
        this.router.navigate(['/leads'])
        this.isLoading = false;
      }, 2000)

    }, (err) => {
      this.loginMessage = err.error.message
      this.isLoading = false;
    })
  }

  openSessionEndedDialog(){
    this.dialog.open(SessionEndedDialogComponent);
  }

  onSignUp(){
    this.router.navigate(['/signup'])
  }

  getTokenExpiration(token: any){
    const decodedToken = jwtDecode(token);
    const expirationTime = decodedToken['exp']! * 1000;
    return new Date(expirationTime);
  }

  getTimeLeftBeforeExpiration(token: any) {
    const expirationDate = this.getTokenExpiration(token);
    const currentTime = new Date();
    const timeLeft = expirationDate!.getTime() - currentTime.getTime();
    return timeLeft > 0 ? timeLeft : 0;
  }
}