import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SystemAdminProfileComponent } from './system-admin-profile/system-admin-profile.component';
import { CompanyFormComponent } from './company-form/company-form.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login' , component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: SystemAdminProfileComponent},
  {path: 'companyForm', component: CompanyFormComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full' }, // Podrazumevana ruta
  {path: '**', redirectTo: '/home' } ,// Rukovanje nepoznatim rutama

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
