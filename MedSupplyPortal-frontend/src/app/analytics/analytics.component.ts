import { Component } from '@angular/core';
import { CompanyService } from '../services/company/company.service';
import { AnalyticsService } from '../services/analytics/analytics.service';
import { TokenStorageService } from '../services/user/token.service';
import { Company } from '../shared/model/company';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent {
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

  averageRating: number = 0;
  bookingsStats: any;

  constructor(private companyService: CompanyService, private analyticsService: AnalyticsService, private tokenStorage: TokenStorageService ) { }

  ngOnInit(): void {
    const companyId = this.tokenStorage.getCompanyId();
    if(companyId)
    {     
      this.loadCompanyData(companyId);
    }
    this.loadBookingsStats('monthly')
  }

  loadCompanyData(id: number): void {
    this.companyService.getById(id).subscribe(
      (data: Company) => {
        this.company = data;
        this.averageRating = this.company.averageRating;
      },
      (error) => {
        console.error('Error fetching company data:', error);
      }
    );
  }
  loadBookingsStats(timePeriod: string) {
    if(timePeriod == 'monthly')
      {
        this.getMonthlyAppointments()
      }
  }

  getInterval()
  {
    let interval = 0;
    if(this.company.appointments){
      const appointment = this.company.appointments[0]
      let firstYear = appointment.slot.getFullYear()
      this.company.appointments.forEach(appointment => {
        if(appointment.slot.getFullYear() < firstYear)
          firstYear = appointment.slot.getFullYear();
      });
      let lastYear = appointment.slot.getFullYear()
      this.company.appointments.forEach(appointment => {
        if(appointment.slot.getFullYear() > lastYear)
          lastYear = appointment.slot.getFullYear();
      });
      return interval = (lastYear - firstYear + 1);
    }
    return 0;
  }

  getMonthlyAppointments(){
    const interval = this.getInterval();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthlyAppointments = new Map();

  monthNames.forEach(month => monthlyAppointments.set(month, 0));

  if(this.company.appointments)
  this.company.appointments.forEach(appointment => {
  const appointmentDate = new Date(appointment.slot);
  const month = monthNames[appointmentDate.getMonth()];
  const currentCount = monthlyAppointments.get(month) || 0;
  monthlyAppointments.set(month, currentCount + 1); 
  this.bookingsStats = monthlyAppointments
  });
  }
}
