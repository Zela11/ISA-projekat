import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/user/token.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  isLoggedIn: boolean = false;
  userId: number | null = null;

  constructor(private userService: UserService, private tokenStorage: TokenStorageService) {}
  ngOnInit(): void {
    this.checkLoginStatus();
    }


  checkLoginStatus(): void {
    this.userService.currentUser.subscribe(userId => {
      this.isLoggedIn = !!userId;
      this.userId = userId;
    });
  }

  logout(): void {
    this.userService.logout();
    this.isLoggedIn = false;
  }
}
