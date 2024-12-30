import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login-page/login-page.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuard } from './guards/auth.guard';
import { DashBoardComponent } from './components/dashboard/dashboard.component';
import { LeadSummaryComponent } from './components/lead-management/lead-summary/lead-summary.component';
import { LeadManagementComponent } from './components/lead-management/lead-management.component';
import { InteractionsComponent } from './components/interactions/interactions.component';
import { CallPlannerComponent } from './components/call-planner/call-planner.component';
import { PerformanceComponent } from './components/performance-metrics/performance-metrics.component';

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
  },
  {
    path: 'interactions',
    component: InteractionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'call-planner',
    component: CallPlannerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'performance-metrics',
    component: PerformanceComponent,
    canActivate: [AuthGuard]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
