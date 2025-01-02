import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/loginPage/loginPage.component';
import { SignUpComponent } from './components/signUp/signUp.component';
import { AuthGuard } from './guards/auth.guard';
import { LeadSummaryComponent } from './components/leadManagement/leadSummary/leadSummary.component';
import { LeadManagementComponent } from './components/leadManagement/leadManagement.component';
import { InteractionsComponent } from './components/interactions/interactions.component';
import { CallPlannerComponent } from './components/callPlanner/callPlanner.component';
import { PerformanceComponent } from './components/performanceMetrics/performanceMetrics.component';

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
    component: LeadManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'leads/:id/summary',
    component: LeadSummaryComponent,
    canActivate: [AuthGuard]
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
