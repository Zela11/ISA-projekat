import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/user/token.service';
import { UserService } from '../services/user/user.service';
import { CompanyService } from '../services/company/company.service';
import { Company } from '../shared/model/company';
import { User } from '../shared/model/user';

@Component({
  selector: 'app-system-admin-profile',
  templateUrl: './system-admin-profile.component.html',
  styleUrls: ['./system-admin-profile.component.css']
})
export class SystemAdminProfileComponent implements OnInit {

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
  }
  constructor(private tokenStorage: TokenStorageService, private userService: UserService, private companyService: CompanyService) {}

  ngOnInit(): void {
    this.userId = this.tokenStorage.getUserId();
    this.fetchUser();
    this.fetchCompanies();

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


  systemAdmins = [
    {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com'
    },
    {
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob.smith@example.com'
    },
    {
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie.brown@example.com'
    }
  ];

  showCompanyPopup: boolean = false;
  showSysAdminPopup: boolean = false;

  newCompany: Company = {
    id: 0,
    name: '',
    description: '',
    address: {
      city: '',
      country: '',
      street: '',
      latitude: undefined,
      longitude: undefined
    },
    averageRating: 0
  };
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
      street: '', // Assuming you want a street field for Address
      latitude: undefined, // Optional, can be null
      longitude: undefined, // Optional, can be null
    },
    companyId: undefined // Optional, if applicable
  };

  showAddAdminPopup(company: any): void {
    console.log(`Add admin for company: ${company.name}`);
  }
  addCompany(): void {
    console.log(this.newCompany);
    this.companyService.create(this.newCompany).subscribe(
      response => {
        console.log('Registration successful', response);
      },
      error => {
        console.log('Greska', error);
      }
      
    );
  }

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
        },
        error => {
          console.log('Greska', error);
        }
        
      );
      this.closeSysAdminPopup();
    
  }
  showAddCompanyPopup(): void {
    this.showCompanyPopup = true;
  }

  closeCompanyPopup(): void {
    this.showCompanyPopup = false;
  }
}
