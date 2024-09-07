import { Component } from '@angular/core';
import { CompanyService } from '../services/company/company.service';
import { AnalyticsService } from '../services/analytics/analytics.service';
import { TokenStorageService } from '../services/user/token.service';
import { Company } from '../shared/model/company';
import { Appointment } from '../shared/model/appointment';
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
  appointmentsStats: any;
  reservedAppointmentsStats: any;
  selectedPeriod: string = 'monthly';
  selectedYear: number | undefined;
  availableYears: number[] = [];
  startDate: string | undefined;
  endDate: string | undefined;
  income: number = 0;
  totalIncome: number = 0;

  constructor(private companyService: CompanyService, private analyticsService: AnalyticsService, private tokenStorage: TokenStorageService ) { }

  ngOnInit(): void {
    const companyId = this.tokenStorage.getCompanyId();
    if(companyId)
    {     
      this.loadCompanyData(companyId);
    }
  }

  onPeriodChange(event: any): void {
    const period = event.target.value;
    if (period === 'monthly') {
      this.getMonthlyAppointments(this.selectedYear || new Date().getFullYear());
      this.getMonthlyReservedAppointments(this.selectedYear || new Date().getFullYear())
    } else if (period === 'quarterly') {
      this.getQuarterlyAppointments();
      this.getQuarterlyReservedAppointments();
    } else if (period === 'yearly') {
      this.getYearlyAppointments();
      this.getYearlyReservedAppointments();
    }
  }
  onYearChange(event: any): void {
    const year = event.target.value;
    this.getMonthlyAppointments(year);
  }

  loadCompanyData(id: number): void {
    this.companyService.getById(id).subscribe(
      (data: Company) => {
        this.company = data;
        this.averageRating = this.company.averageRating;
        this.loadYears();
        this.getMonthlyAppointments(new Date().getFullYear());
        this.getMonthlyReservedAppointments(new Date().getFullYear())
        this.company.appointments?.forEach(appointment => {
          if(appointment.status == 2 && appointment.totalPrice)
            this.totalIncome += appointment.totalPrice;
          });
      },
      (error) => {
        console.error('Error fetching company data:', error);
      }
    );
  }

  getMonthlyAppointments(year: number) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    const monthlyAppointments = new Map<string, number>();
    monthNames.forEach(month => monthlyAppointments.set(month, 0));
    
    if (this.company.appointments) {
      this.company.appointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.slot);
        const appointmentYear = appointmentDate.getFullYear(); 
  
        if (appointmentYear == year) {
          const month = monthNames[appointmentDate.getMonth()];
          const currentCount = monthlyAppointments.get(month) || 0;
          monthlyAppointments.set(month, currentCount + 1);
        }
      });
      this.mapToChartData(monthlyAppointments);
    }
  }
  getMonthlyReservedAppointments(year: number) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    const monthlyAppointments = new Map<string, number>();
    monthNames.forEach(month => monthlyAppointments.set(month, 0));
    
    if (this.company.appointments) {
      this.company.appointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.slot);
        const appointmentYear = appointmentDate.getFullYear(); 
  
        if (appointmentYear == year && appointment.status == 2) {
          const month = monthNames[appointmentDate.getMonth()];
          const currentCount = monthlyAppointments.get(month) || 0;
          monthlyAppointments.set(month, currentCount + 1);
        }
      });
      this.mapToReservedChartData(monthlyAppointments);
    }
  }
  getQuarterlyAppointments(): void {
    const quarterlyAppointments = new Map<string, number>();
  
    if (this.company.appointments) {
      this.company.appointments.sort((a, b) => new Date(a.slot).getTime() - new Date(b.slot).getTime());
      this.company.appointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.slot);
        const year = appointmentDate.getFullYear();
        const month = appointmentDate.getMonth(); 
  
        let quarter = '';
  
        if (month <= 2) { 
          quarter = `Q1 ${year}`;
        } else if (month <= 5) { 
          quarter = `Q2 ${year}`;
        } else if (month <= 8) { 
          quarter = `Q3 ${year}`;
        } else { 
          quarter = `Q4 ${year}`;
        }
  
        const currentCount = quarterlyAppointments.get(quarter) || 0;
        quarterlyAppointments.set(quarter, currentCount + 1);
      });
  
      this.mapToChartData(quarterlyAppointments);
    }
  }
  getQuarterlyReservedAppointments(): void {
    const quarterlyAppointments = new Map<string, number>();
  
    if (this.company.appointments) {
      this.company.appointments.sort((a, b) => new Date(a.slot).getTime() - new Date(b.slot).getTime());
      this.company.appointments.forEach(appointment => {
        if(appointment.status == 2){
        const appointmentDate = new Date(appointment.slot);
        const year = appointmentDate.getFullYear();
        const month = appointmentDate.getMonth(); 
  
        let quarter = '';
  
        if (month <= 2) { 
          quarter = `Q1 ${year}`;
        } else if (month <= 5) { 
          quarter = `Q2 ${year}`;
        } else if (month <= 8) { 
          quarter = `Q3 ${year}`;
        } else { 
          quarter = `Q4 ${year}`;
        }
        const currentCount = quarterlyAppointments.get(quarter) || 0;
        quarterlyAppointments.set(quarter, currentCount + 1);
      }
      });
  
      this.mapToReservedChartData(quarterlyAppointments);
    }
  }
  getYearlyAppointments(): void {
    const yearlyAppointments = new Map<string, number>();
  
    if (this.company.appointments) {
      this.company.appointments.sort((a, b) => new Date(a.slot).getTime() - new Date(b.slot).getTime());
      this.company.appointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.slot);
        const year = appointmentDate.getFullYear().toString();
  
        const currentCount = yearlyAppointments.get(year) || 0;
        yearlyAppointments.set(year, currentCount + 1); 
      });
  
      this.mapToChartData(yearlyAppointments);
    }
  }
  getYearlyReservedAppointments(): void {
    const yearlyAppointments = new Map<string, number>();
  
    if (this.company.appointments) {
      this.company.appointments.sort((a, b) => new Date(a.slot).getTime() - new Date(b.slot).getTime());
      this.company.appointments.forEach(appointment => {
        if(appointment.status == 2){
        const appointmentDate = new Date(appointment.slot);
        const year = appointmentDate.getFullYear().toString();
  
        const currentCount = yearlyAppointments.get(year) || 0;
        yearlyAppointments.set(year, currentCount + 1); 
        }
      });
  
      this.mapToReservedChartData(yearlyAppointments);
    }
  }
  private mapToChartData(dataMap: Map<string, number>): any[] {
     this.appointmentsStats = Array.from(dataMap.entries()).map(([name, value]) => ({ name, value }));
    return this.appointmentsStats;
  }
  private mapToReservedChartData(dataMap: Map<string, number>): any[] {
    this.reservedAppointmentsStats = Array.from(dataMap.entries()).map(([name, value]) => ({ name, value }));
   return this.reservedAppointmentsStats;
 }
  loadYears(): void {
    if(this.company.appointments)
      this.company.appointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.slot);
        const appointmentYear = appointmentDate.getFullYear(); 
        if(!this.availableYears.includes(appointmentYear)){
          this.availableYears.push(appointmentYear)
        }
        this.availableYears.sort();
    })
  }
  onDateChange() {
    if (this.startDate && this.endDate) {
      if (new Date(this.startDate) > new Date(this.endDate)) {
        alert('End date must be greater than start date');
        this.endDate = ''; // Clear end date
      } else {
        this.getIncome();
      }
    }
  }
  getIncome() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      
      console.log('Start Date:', start);
      console.log('End Date:', end);
  
      let filteredAppointments: Appointment[] = [];
      if (this.company.appointments) {
        filteredAppointments = this.company.appointments.filter(a => {
          const appointmentDate = new Date(a.slot);
          console.log('Appointment Date:', appointmentDate);
          return appointmentDate >= start && appointmentDate <= end;
        });
        
        console.log('Filtered Appointments:', filteredAppointments);
  
        this.income = 0;
        filteredAppointments.forEach(appointment => {
          console.log('Checking Appointment:', appointment);
          if (appointment.totalPrice && appointment.status === 2) {
            this.income += appointment.totalPrice;
          }
        });
  
        console.log('Total Income:', this.income);
      }
    }
  }
}
