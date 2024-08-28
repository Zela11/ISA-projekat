import { Component } from '@angular/core';
import { Company } from '../shared/model/company';
import { Appointment } from '../shared/model/appointment';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../services/company/company.service';
import { TokenStorageService } from '../services/user/token.service';
import { UserService } from '../services/user/user.service';
import { Equipment } from '../shared/model/equipment';
import { User } from '../shared/model/user';

@Component({
  selector: 'app-reserved-equipment',
  templateUrl: './reserved-equipment.component.html',
  styleUrls: ['./reserved-equipment.component.css']
})
export class ReservedEquipmentComponent {
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
  selectedEquipment: Equipment = {
    id: 0,
    name: '',
    description: '',
    isAvailable: false,
    companyId: 0,
    amount: 0,
    reservedAmount: 0
  };
  user: User = {
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
    isFirstLogin: false
  };
  userId: number | null = null;
  reservedAppointments: Appointment[] | undefined;
  expiredAppointments: Appointment[] | undefined;
  userNames: { [key: number]: string } = {};
  currentTime: Date = new Date();
  intervalId: any;
  constructor(private route: ActivatedRoute, private companyService: CompanyService, private userService: UserService, private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    const companyId = Number(this.route.snapshot.paramMap.get('id'));
    this.companyService.getById(companyId).subscribe((data: Company) => {
      this.company = data;
      this.filterReservedAppointments();
      this.startRealTimeUpdates();
    });
    this.userId = this.tokenStorage.getUserId();
  }

  filterReservedAppointments(): void {
    this.reservedAppointments = this.company?.appointments?.filter
    (appointment => (appointment.status === 1) && (appointment.administratorId == this.userId));
    
    if(this.reservedAppointments)
      this.loadUserNames(this.reservedAppointments);
  }

  loadUserNames(appointments: Appointment[]): void {
    appointments.forEach(appointment => {
      if (appointment.userId !== null && !this.userNames[appointment.userId]) {
        this.userService.getById(appointment.userId).subscribe(user => {
          this.userNames[appointment.userId as number] = `${user.firstName} ${user.lastName}`;
        });
      }
    });
  }
  startRealTimeUpdates(): void {
    this.intervalId = setInterval(() => {
      this.currentTime = new Date();
      this.checkForExpiredAppointments();
    }, 1000);
  }
  checkForExpiredAppointments(): void {
      if(this.reservedAppointments){

        this.reservedAppointments.forEach(appointment => {
          const appointmentEnd = new Date(appointment.slot);
          appointmentEnd.setMinutes(appointmentEnd.getMinutes() + Number(appointment.duration));
          if(appointment.status == 1 && this.currentTime > appointmentEnd)
            this.expireAppointment(appointment)
      });
    }
  }


  isCurrentTimeInSlot(appointment: Appointment): boolean {
    if (appointment.slot && appointment.duration) {
      const appointmentStart = new Date(appointment.slot);
      const appointmentEnd = new Date(appointment.slot);
      appointmentEnd.setMinutes(appointmentEnd.getMinutes() + Number(appointment.duration));
      return this.currentTime >= appointmentStart && this.currentTime <= appointmentEnd;
    }
    return false;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  completeAppointment(appointment: Appointment): void {
    appointment.status = 2;
    this.companyService.completeAppointment(this.company?.id ,appointment).subscribe(
      () => {
        this.filterReservedAppointments()
        const equipment = this.company.equipmentList?.find(e => e.id == appointment.equipmentId)
        if(equipment)
          this.selectedEquipment = equipment;
        this.selectedEquipment.reservedAmount = this.selectedEquipment.reservedAmount - (appointment.equipmentAmount || 0);
        this.selectedEquipment.amount = this.selectedEquipment.amount - (appointment.equipmentAmount || 0);
        this.companyService.updateEquipmentAmount(this.company.id, this.selectedEquipment).subscribe(
          (response) => {
            if(this.company.equipmentList) 
            {
              const index = this.company.equipmentList.findIndex(e => e.id === this.selectedEquipment.id);
              if (index !== -1) {
                this.company.equipmentList[index] = { ...this.selectedEquipment };
              }
            }
          },
          (error) => {
            console.error('Error updating equipment:', error);
          }
        );
        alert('Appointment completed successfully')
      },
      (error: any) => {
        console.error('Error updating appointment:', error);
      }
    )
  }
  expireAppointment(appointment: Appointment): void{
    appointment.status = 3;
    console.log(appointment)
    this.companyService.completeAppointment(this.company?.id ,appointment).subscribe(
      () => {
        this.filterReservedAppointments();
        if(appointment.userId){
        this.userService.getById(appointment.userId).subscribe(
          (user) => {
            this.user = user;
            this.user.penaltyPoints += 2;
            console.log(this.user)
            if(appointment.userId)
            this.userService.updatePenalty(this.user, appointment.userId).subscribe(
              (response) => {
                console.log('User updated successfully');
              },
              (error) => {
                console.error('Error updating profile', error);
              }
            );
          }
        )
      }
      const equipment = this.company.equipmentList?.find(e => e.id == appointment.equipmentId)
        if(equipment)
          this.selectedEquipment = equipment;
        this.selectedEquipment.reservedAmount = this.selectedEquipment.reservedAmount - (appointment.equipmentAmount || 0);
        this.companyService.updateEquipmentAmount(this.company.id, this.selectedEquipment).subscribe(
          (response) => {
            if(this.company.equipmentList) 
            {
              const index = this.company.equipmentList.findIndex(e => e.id === this.selectedEquipment.id);
              if (index !== -1) {
                this.company.equipmentList[index] = { ...this.selectedEquipment };
              }
            }
          },
          (error) => {
            console.error('Error updating equipment:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error updating appointment:', error);
      }
    )
  }
}
