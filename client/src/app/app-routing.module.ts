import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login-page/login-page.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuard } from './guards/auth.guard';
import { DashBoardComponent } from './components/dashboard/dashboard.component';
import { LeadSummaryComponent } from './components/lead-management/lead-summary/lead-summary.component';
import { LeadManagementComponent } from './components/lead-management/lead-management.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'leads',
    component: DashBoardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: LeadManagementComponent,
        canActivate: [AuthGuard]
      },
      {
        path: ':id/summary',
        component: LeadSummaryComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
