import { Component, OnInit } from '@angular/core';
import { User } from '../shared/model/user';
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/user/token.service';

@Component({
  selector: 'app-company-admin-profile',
  templateUrl: './company-admin-profile.component.html',
  styleUrls: ['./company-admin-profile.component.css']
})
export class CompanyAdminProfileComponent implements OnInit{

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isChangePasswordPopupVisible: boolean = false;
  passwordsDoNotMatch: boolean = false;

  admin: User = {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
    userType: 1,
    penaltyPoints: 0,
    address: {
      city: '',
      country: '',
      street: '',
      latitude: undefined,
      longitude: undefined,
    },
    companyId: undefined,
    occupation: '',
    isFirstLogin: false,
    points: 0,
    categoryName: ''
  };

  constructor(private userService: UserService, private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    this.fetchAdminProfile();
  }
  fetchAdminProfile(): void {
    // Assume we have a method to get the current admin's profile
    this.userService.getById(this.tokenStorage.getUserId()).subscribe(
      (data: User) => {
        this.admin = data;
      },
      (error) => {
        console.error('Error fetching admin profile', error);
      }
    );
  }
  saveChanges(): void {
    this.userService.update(this.admin).subscribe(
      (response) => {
        console.log('Profile updated successfully');
      },
      (error) => {
        console.error('Error updating profile', error);
      }
    );
  }
  changePassword(): void {
    console.log('Change password clicked');
  }
  openChangePasswordPopup(): void {
    this.isChangePasswordPopupVisible = true;
  }

  closeChangePasswordPopup(): void {
    this.currentPassword = ''; // Resetuje trenutnu lozinku
    this.isChangePasswordPopupVisible = false;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordsDoNotMatch = false;
  }

  updatePassword(): void {
    
    if (this.newPassword !== this.confirmPassword) {
      this.passwordsDoNotMatch = true;
      return;
    }
    this.admin.password = this.newPassword;
    this.userService.update(this.admin).subscribe(
      (response) => {
        console.log('Password updated successfully');
        this.closeChangePasswordPopup();
      },
      (error) => {
        console.error('Error updating password', error);
      }
    );
  }
}
