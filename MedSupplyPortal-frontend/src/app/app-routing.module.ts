import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SystemAdminProfileComponent } from './system-admin-profile/system-admin-profile.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { CompanyAdminProfileComponent } from './company-admin-profile/company-admin-profile.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { ReservedEquipmentComponent } from './reserved-equipment/reserved-equipment.component';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { LoyaltyProgramComponent } from './loyalty-program/loyalty-program.component';
import { AnalyticsComponent } from './analytics/analytics.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login' , component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'company-admin-profile', component: CompanyAdminProfileComponent},
  {path: 'companyForm', component: CompanyFormComponent},
  {path: 'company-profile', component: CompanyProfileComponent},
  {path: 'company-list', component: CompanyListComponent },
  {path: 'company/:id', component: CompanyDetailsComponent },
  {path: 'system-admin-profile', component: SystemAdminProfileComponent},
  {path: 'reservations/:id', component: ReservedEquipmentComponent},
  {path: 'equipment-list', component: EquipmentListComponent},
  {path: 'loyaltyProgramForm', component: LoyaltyProgramComponent},
  {path: 'analytics', component: AnalyticsComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: '**', redirectTo: '/home' } ,

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
