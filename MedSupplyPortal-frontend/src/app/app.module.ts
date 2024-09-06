import { NgModule, ɵsetInjectorProfilerContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { SystemAdminProfileComponent } from './system-admin-profile/system-admin-profile.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { CompanyAdminProfileComponent } from './company-admin-profile/company-admin-profile.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { FilterEquipmentPipe } from './shared/pipes/filter-equipment.pipe';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { ReservedEquipmentComponent } from './reserved-equipment/reserved-equipment.component';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';  // Dodaj ovu liniju
import { FullCalendarModule } from '@fullcalendar/angular'; // FullCalendar moduli
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { LoyaltyProgramComponent } from './loyalty-program/loyalty-program.component';
import { AnalyticsComponent } from './analytics/analytics.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    LoginComponent,
    RegisterComponent,
    SystemAdminProfileComponent,
    CompanyFormComponent,
    CompanyAdminProfileComponent,
    CompanyProfileComponent,
    FilterEquipmentPipe,
    CompanyListComponent,
    CompanyDetailsComponent,
    ReservedEquipmentComponent,
    EquipmentListComponent,
    LoyaltyProgramComponent,
    AnalyticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
