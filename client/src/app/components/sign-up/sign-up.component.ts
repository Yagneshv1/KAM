import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  form = new FormGroup({ 
    username: new FormControl('', [Validators.required]), 
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required])
  });

  loginMessage: string = '';
  public isLoading: boolean = false
  constructor(private authService: AuthenticationService,
    private router: Router
  ) {

  }

  onSignUp() {
    this.isLoading = true
    const userDetails = {
      'username': this.form.get('username')?.value,
      'password': this.form.get('password')?.value,
      'name': this.form.get('name')?.value,
      'role': this.form.get('role')?.value,
      'dob': this.form.get('dob')?.value,
      'mobile': this.form.get('mobile')?.value,
      'email': this.form.get('email')?.value
    }

    this.authService.signUpUser(userDetails).subscribe(res => {
      this.loginMessage = 'User registered successfully! Continue to login page.'
      this.isLoading = false
    }, (err) => {
      console.log(err)
      this.loginMessage = 'Failed to register user.'
      this.isLoading = false
    })
  }

  onLoginUser() {
    this.router.navigate(['/login'])
  }

}