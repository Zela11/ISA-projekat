import { Component } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    if (this.email && this.password) {
       this.userService.login(this.email, this.password).subscribe(
        response => {
          console.log('Token:', response.token);
          this.userService.handleLoginResponse(response);
          this.router.navigate(['/home']);
        }, error => {
          console.error('Login error:', error);
        }
       );
    }
  }
}
