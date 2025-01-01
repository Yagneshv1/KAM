import { Component } from '@angular/core';
import { LoginComponent } from '../login-page/login-page.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

interface MenuNode {
    name: string;
    children?: MenuNode[];
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
  })
export class DashBoardComponent {
 
  public tabs = [
    { label: 'Lead Manager', routerLink: '/leads' },
    { label: 'Interaction Manager', routerLink: '/interactions' },
    { label: 'Call Planner', routerLink: '/call-planner' },
    { label: 'Performance Manager', routerLink: '/performance-metrics' }
  ];

  public userLogin: boolean = false;

  constructor(private authService: AuthenticationService,
    private router: Router
  ) {
    this.authService.isUserLoggedIn.subscribe(loginStatus => {
      this.userLogin = loginStatus
    })
  }

  onLogoutUser() {
    this.authService.invalidateToken()
    this.authService.isUserLoggedIn.next(false)
    this.router.navigate(['/login'])
  }
}