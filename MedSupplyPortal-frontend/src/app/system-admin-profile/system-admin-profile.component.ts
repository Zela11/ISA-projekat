import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/user/token.service';
import { UserService } from '../services/user/user.service';
import { CompanyService } from '../services/company/company.service';
import { Company } from '../shared/model/company';
import { User } from '../shared/model/user';
import * as L from 'leaflet';
import { Map, tileLayer, Marker, icon, LatLng } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-system-admin-profile',
  templateUrl: './system-admin-profile.component.html',
  styleUrls: ['./system-admin-profile.component.css']
})
export class SystemAdminProfileComponent implements OnInit {

  showCompanyAdminPopup: boolean = false;

  userId : number = 0;
  user : User = {
    id: 0, 
    firstName: '',
    lastName: '', 
    email: '',
    password: '',
    phoneNumber: '',
    occupation: '',
    userType: 0, 
    penaltyPoints: 0,
    address: {
      city: '',
      country: '',
      street: '',
      latitude: undefined,
      longitude: undefined
    },
    companyId: undefined,
    isFirstLogin: false,
    points: 0,
    categoryName: ''
  }
  constructor(private router: Router, private tokenStorage: TokenStorageService, private userService: UserService, private companyService: CompanyService) {}






  ngOnInit(): void {
    this.userId = this.tokenStorage.getUserId();
    this.fetchUser();
    this.fetchCompanies();
    this.fetchAdmins();

  }

  fetchAdmins() {
    this.userService.getSystemAdmins().subscribe(
      (data: User[]) => {
        this.systemAdmins = data;
      },
      (error) => {
        console.log("Greska prilikom fetchovanja admina", error);
      }
    );
  }

  fetchCompanies() {
    this.companyService.getAll().subscribe(
      (data: Company[]) => {
       this.companies = data;
      },
      (error) => {
        console.error('Failed to fetch companies', error);
      }
    );
  }

  fetchUser() {
    console.log("fetc usera");
    this.userService.getById(this.userId).subscribe(
      (user) => {
        this.user = user;
        console.log('Fetched user:', this.user.firstName);

      }
    )
  }
  companies: Company[] = [];
  systemAdmins: User[] = [];

  showSysAdminPopup: boolean = false;


  newSysAdmin : User  ={
    id: 0,
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    occupation: '',
    userType: 2,
    penaltyPoints: 0,
    address: {
      city: '',
      country: '',
      street: '', 
      latitude: undefined,
      longitude: undefined, 
    },
    companyId: undefined,
    isFirstLogin: true,
    points: 0,
    categoryName: ''
  };

  newCompanyAdmin: User = {
    id: 0,
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    occupation: '',
    userType: 1,
    penaltyPoints: 0,
    address: {
      city: '',
      country: '',
      street: '', 
      latitude: undefined,
      longitude: undefined, 
    },
    companyId: 0,
    isFirstLogin: true,
    points: 0,
    categoryName: ''
  };
 

  showAddSysAdminPopup(): void {
    this.showSysAdminPopup = true;
  }

  closeSysAdminPopup(): void {
    this.showSysAdminPopup = false;
  }

  addSysAdmin(): void {
      console.log(this.newSysAdmin);
      this.userService.register(this.newSysAdmin).subscribe(
        response => {
          console.log('Registration successful', response.message);
          this.fetchAdmins();
        },
        error => {
          console.log('Greska', error);
        }
        
      );
      this.closeSysAdminPopup();
    
  }

  showAddAdminPopup(company: any): void {
    this.newCompanyAdmin.companyId = company.id;
    this.showCompanyAdminPopup = true;
  }

  closeCompanyAdminPopup(): void {
    this.showCompanyAdminPopup = false;
  }

  addCompanyAdmin(): void {
    this.userService.register(this.newCompanyAdmin).subscribe(
      response => {
        console.log('Company Admin added successfully', response.message);
      },
      error => {
        console.log('Greska', error);
      }
    );
    this.closeCompanyAdminPopup();
  }


}
