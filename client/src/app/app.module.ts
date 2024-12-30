import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login-page/login-page.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatTreeModule} from '@angular/material/tree';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashBoardComponent } from './components/dashboard/dashboard.component';
import { LeadManagementComponent } from './components/lead-management/lead-management.component';
import { AgGridModule } from 'ag-grid-angular';
import { TableComponent } from './components/table/table.component';
import { registerAllModules } from 'handsontable/registry';
import { AddLeadDialogComponent } from './components/dialog/add-lead/add-lead-dialog.component';
import { LeadSummaryComponent } from './components/lead-management/lead-summary/lead-summary.component';
import { LeadPocComponent } from './components/lead-management/lead-poc/lead-poc.component';
import { AddLeadPocDialogComponent } from './components/dialog/add-lead-poc/add-lead-poc.component';
import { InteractionsComponent } from './components/interactions/interactions.component';
import { AddInteractionDialogComponent } from './components/dialog/add-interaction/add-interaction-dialog.component';
import { CallPlannerComponent } from './components/call-planner/call-planner.component';
import { PerformanceComponent } from './components/performance-metrics/performance-metrics.component';

registerAllModules();

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    DashBoardComponent,
    LeadManagementComponent,
    TableComponent,
    AddLeadDialogComponent,
    LeadSummaryComponent,
    LeadPocComponent,
    AddLeadPocDialogComponent,
    InteractionsComponent,
    AddInteractionDialogComponent,
    CallPlannerComponent,
    PerformanceComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatSidenavModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    AgGridModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
