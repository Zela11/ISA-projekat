import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../shared/model/company';
import { CompanyService } from '../services/company/company.service';
import { Appointment } from '../shared/model/appointment';
import { Equipment } from '../shared/model/equipment';
import { TokenStorageService } from '../services/user/token.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {
  company: Company = {
    id: 0,
    name: '',
    description: '',
    address: {
      city: '',
      country: '',
      street: '',
      latitude: 0,
      longitude: 0
    },
    start: '',
    end: '',
    averageRating: 0,
    appointments: [],
    companyAdmins: [],
    equipmentList: []
  };
  availableAppointments: Appointment[] | undefined;
  showAppointments: boolean | undefined;
  selectedEquipment: Equipment = {
    id: 0,
    name: '',
    description: '',
    isAvailable: false,
    companyId: 0,
    amount: 0,
    reservedAmount: 0
  };
  userId: number | null = null;

  constructor(private route: ActivatedRoute, private companyService: CompanyService, private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    const companyId = Number(this.route.snapshot.paramMap.get('id'));
    this.companyService.getById(companyId).subscribe((data: Company) => {
      this.company = data;
      console.log(this.company.equipmentList)
      this.filterAvailableAppointments();
      this.showAppointments = false;
    });
    this.userId = this.tokenStorage.getUserId();
  }

  filterAvailableAppointments(): void {
    this.availableAppointments = this.company?.appointments?.filter(appointment => appointment.status === 0)
    console.log(this.availableAppointments)
  }

  openModal(equipment: Equipment): void {
    this.showAppointments = true;
    this.selectedEquipment = equipment;
  }
  closeModal(): void {
    this.showAppointments = false;
  }

  reserveAppointment(appointment: Appointment){
    appointment.equipmentId = this.selectedEquipment?.id;
    appointment.userId = this.userId;
    this.companyService.reserveAppointment(this.company?.id ,appointment).subscribe(
      () => {
        this.closeModal();
        alert('Appointment reserved successfully')
      },
      (error: any) => {
        console.error('Error updating appointment:', error);
      }
    )
    this.selectedEquipment.reservedAmount += appointment.equipmentAmount || 0
    this.companyService.updateEquipmentAmount(this.company.id, this.selectedEquipment).subscribe(
      (response) => {
        if(this.company.equipmentList) 
        {
          const index = this.company.equipmentList.findIndex(e => e.id === this.selectedEquipment.id);
          if (index !== -1) {
            this.company.equipmentList[index] = { ...this.selectedEquipment };
          }
        }
       
        this.closeModal();
        alert('Equipment updated successfully!');
      },
      (error) => {
        console.error('Error updating equipment:', error);
      }
    );
  }
}

