import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/loginPage/loginPage.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import { SetFilterModule } from 'ag-grid-enterprise';
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
import { SignUpComponent } from './components/signUp/signUp.component';
import { DashBoardComponent } from './components/dashboard/dashboard.component';
import { LeadManagementComponent } from './components/leadManagement/leadManagement.component';
import { AgGridModule } from 'ag-grid-angular';
import { TableComponent } from './components/table/table.component';
import { registerAllModules } from 'handsontable/registry';
import { AddEditLeadDialogComponent } from './components/dialog/addEditLead/addEditLeadDialog.component';
import { LeadSummaryComponent } from './components/leadManagement/leadSummary/leadSummary.component';
import { LeadPocComponent } from './components/leadManagement/leadPoc/leadPoc.component';
import { AddEditLeadPocDialogComponent } from './components/dialog/adEditLeadPoc/addEditLeadPoc.component';
import { InteractionsComponent } from './components/interactions/interactions.component';
import { AddInteractionDialogComponent } from './components/dialog/addInteraction/addInteractionDialog.component';
import { CallPlannerComponent } from './components/callPlanner/callPlanner.component';
import { PerformanceComponent } from './components/performanceMetrics/performanceMetrics.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthInterceptor } from './authInterceptor';
import { ModuleRegistry } from 'ag-grid-community';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SessionEndedDialogComponent } from './components/dialog/sessionEndedDialog/sessionEndedDialog.component';
import { EditLeadRendererComponent } from './components/dialog/editLead/editLead.component';
import { EditLeadPocRendererComponent } from './components/dialog/editPoc/editPoc.component';

ModuleRegistry.registerModules([SetFilterModule]);
registerAllModules();

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    DashBoardComponent,
    LeadManagementComponent,
    TableComponent,
    AddEditLeadDialogComponent,
    LeadSummaryComponent,
    LeadPocComponent,
    AddEditLeadPocDialogComponent,
    InteractionsComponent,
    AddInteractionDialogComponent,
    CallPlannerComponent,
    PerformanceComponent,
    SessionEndedDialogComponent,
    EditLeadRendererComponent,
    EditLeadPocRendererComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatToolbarModule,
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
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
