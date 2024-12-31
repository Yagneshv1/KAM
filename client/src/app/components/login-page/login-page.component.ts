import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { jwtDecode } from 'jwt-decode';
import { MatDialog } from '@angular/material/dialog';
import { SessionEndedDialogComponent } from '../dialog/session-ended-dialog/sessionEndedDialog.component';

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
    private router: Router,
    private dialog: MatDialog
  ) {

  }

  onLoginUser() {
    this.authService.loginUser(this.username, this.password).subscribe((response: any) => {
      this.authService.saveToken(response.access_token)
      const timeLeftToExpire = this.getTimeLeftBeforeExpiration(response.access_token)
      setTimeout(()=>{
        this.openSessionEndedDialog()
      }, timeLeftToExpire)
      this.loginMessage = 'Login Successful! Redirecting to home page...'
      setTimeout(() => {
        this.router.navigate(['/leads'])
      }, 5000)
    }, (err) => {
      this.loginMessage = err.error.message
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