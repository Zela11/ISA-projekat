import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { User } from 'src/app/shared/model/user';
import { TokenStorageService } from '../services/user/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showPasswordChangePopup = false;
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  user: User | null = null;

  constructor(private userService: UserService, private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    this.checkUser();
  }

  checkUser(): void {
    const userId = this.tokenStorage.getUserId();
    if (userId) {
      this.userService.getById(userId).subscribe(
        (user: User) => {
          this.user = user;
          console.log(user);
          if (user.isFirstLogin) {
            this.showPasswordChangePopup = true;
          }
        },
        (error) => {
          console.error('Error fetching user', error);
        }
      );
    }
  }

  changePassword(): void {

    if (this.newPassword !== this.confirmNewPassword) {
      alert('New passwords do not match!');
      return;
    }
    if(this.currentPassword === this.newPassword) {
      alert('New password is the same as the current one');
      return;
    }

    this.userService.changePassword(this.currentPassword, this.newPassword).subscribe(
      () => {
        alert('Password changed successfully');
        this.showPasswordChangePopup = false;
      },
      (error) => {
        alert('Failed to change password');
        console.error(error);
      }
    );
  }
}
