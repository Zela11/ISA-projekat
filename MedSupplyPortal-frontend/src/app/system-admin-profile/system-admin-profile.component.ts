import { Component } from '@angular/core';

@Component({
  selector: 'app-system-admin-profile',
  templateUrl: './system-admin-profile.component.html',
  styleUrls: ['./system-admin-profile.component.css']
})
export class SystemAdminProfileComponent {
  adminFirstName: string = 'John';
  adminLastName: string = 'Doe';
  companies = [
    {
      name: 'Tech Innovations Inc.',
      description: 'A leading tech company specializing in innovative solutions.',
      averageRating: 4.5
    },
    {
      name: 'Creative Solutions LLC',
      description: 'A company focused on creative marketing and design.',
      averageRating: 4.2
    },
    {
      name: 'Healthwise Corp.',
      description: 'Provides health-related products and services.',
      averageRating: 4.7
    }
  ];

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

  newCompany = {
    name: '',
    description: '',
    averageRating: 0
  };
  newSysAdmin = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };

  // Method to handle the add admin button click
  showAddAdminPopup(company: any): void {
    // Implement the logic to show a popup or modal for adding an admin
    console.log(`Add admin for company: ${company.name}`);
  }
  addCompany(): void {
    if (this.newCompany.name && this.newCompany.description && this.newCompany.averageRating) {
      this.companies.push({ ...this.newCompany });
      this.newCompany = { name: '', description: '', averageRating: 0 }; // Clear the form
      this.closeCompanyPopup();
    }
  }

  showAddSysAdminPopup(): void {
    this.showSysAdminPopup = true;
  }

  closeSysAdminPopup(): void {
    this.showSysAdminPopup = false;
  }

  addSysAdmin(): void {
    if (this.newSysAdmin.email && this.newSysAdmin.password && this.newSysAdmin.firstName && this.newSysAdmin.lastName) {
      this.systemAdmins.push({ ...this.newSysAdmin });
      this.newSysAdmin = { email: '', password: '', firstName: '', lastName: '' }; // Clear the form
      this.closeSysAdminPopup();
    }
  }
  showAddCompanyPopup(): void {
    this.showCompanyPopup = true;
  }

  closeCompanyPopup(): void {
    this.showCompanyPopup = false;
  }
}
