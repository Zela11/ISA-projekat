import { Component } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  firstname: string = '';
  lastname: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private userService: UserService, private router: Router) {}


  onRegister(form: NgForm): void {
    if (form.valid && this.password === this.confirmPassword) {
      const { email, firstname, lastname, password } = this;
      this.userService.register(email, firstname, lastname, password).subscribe(
        response => {
          console.log('Registration successful', response.message);
          this.router.navigate(['login']);
        },
        error => {
          console.error('Registration error', error);
          // Prikazivanje poruke o grešci
        }
      );
    } else {
      console.log('Form is invalid or passwords do not match');
    }
  }
}