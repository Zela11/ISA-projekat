import { Component, OnInit } from '@angular/core';
import { Company } from '../shared/model/company';
import { CompanyService } from '../services/company/company.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];

  constructor(private companyService: CompanyService, private router: Router) {}

  ngOnInit(): void {
    this.companyService.getAll().subscribe((data: Company[]) => {
      this.companies = data;
    });
  }

  navigateToCompanyDetails(id: number): void {
    this.router.navigate([`company/${id}`]);

  }
}

