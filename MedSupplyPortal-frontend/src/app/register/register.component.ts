import { Component } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../shared/model/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    occupation: '',
    userType: 0, // Default value, adjust as necessary
    penaltyPoints: 0, // Default value, adjust as necessary
    address: {
      city: '',
      country: '',
      street: '', // Assuming you want a street field for Address
      latitude: undefined, // Optional, can be null
      longitude: undefined, // Optional, can be null
    },
    companyId: undefined // Optional, if applicable
  };
  password: string = '';
  confirmPassword: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onRegister(form: NgForm): void {
    if (form.valid && this.password === this.confirmPassword) {
      this.user.password = this.password;
      this.userService.register(this.user).subscribe(
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
