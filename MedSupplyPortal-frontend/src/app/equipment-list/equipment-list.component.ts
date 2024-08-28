import { Component, OnInit } from '@angular/core';
import { Equipment } from '../shared/model/equipment';
import { EquipmentService } from '../services/equipment/equipment.service';
import { CompanyService } from '../services/company/company.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.css']
})
export class EquipmentListComponent implements OnInit {
  equipmentList: EquipmentWithCompany[] = [];
  searchQuery: string = '';
  selectedCompany: string = ''; // Added for company filter
  selectedType: string = ''; // Added for equipment type filter
  companies: { name: string }[] = []; // Added for company filter

  constructor(private equipmentService: EquipmentService, private companyService: CompanyService) {}

  ngOnInit(): void {
    this.getAllEquipment();
    this.loadCompanies(); // Added for company filter
  }

  getAllEquipment(): void {
    this.equipmentService.getAllEquipment()
      .subscribe((data) => {
        const requests = data.map(equipment => 
          this.companyService.getById(equipment.companyId).pipe(
            map(company => ({ ...equipment, companyName: company.name }))
          )
        );

        forkJoin(requests).subscribe((result) => {
          this.equipmentList = result;
        });
      });
  }

  loadCompanies(): void {
    this.companyService.getAll().subscribe(data => {
      this.companies = data;
    });
  }

  filterEquipment(): EquipmentWithCompany[] {
    return this.equipmentList.filter(equipment =>
      equipment.name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
      (this.selectedCompany === '' || equipment.companyName === this.selectedCompany) &&
      (this.selectedType === '' || equipment.type.toString() === this.selectedType)
    );
  }

  getEquipmentTypeName(type: number): string {
    switch (type) {
      case 0: return 'Diagnostic';
      case 1: return 'Therapeutic';
      case 2: return 'Surgical';
      case 3: return 'Laboratory';
      default: return 'Unknown';
    }
  }
}

interface EquipmentWithCompany extends Equipment {
  companyName?: string;
}
