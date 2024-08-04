import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login' , component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Podrazumevana ruta
  { path: '**', redirectTo: '/home' } // Rukovanje nepoznatim rutama
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
