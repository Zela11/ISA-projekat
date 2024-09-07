import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from '../services/company/company.service';
import { TokenStorageService } from '../services/user/token.service';
import { Company } from '../shared/model/company';
import * as L from 'leaflet'; // Uvoz Leaflet biblioteke
import { UserService } from '../services/user/user.service';
import { User } from '../shared/model/user';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { Equipment } from '../shared/model/equipment';
import { Appointment } from '../shared/model/appointment';
import { Calendar, CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventInput } from '@fullcalendar/core'; // Ensure you import EventInput
import listPlugin from '@fullcalendar/interaction'; // Import List Plugin

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {

  calendarOptions: CalendarOptions | undefined;
  viewMode: string = 'dayGridMonth'; // Default view mode


  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  showAppointmentModal: boolean = false;
  isAppointmentUpdateMode: boolean = false;
  newAppointment: Appointment = {
    companyId: 0,
    administratorId: 0,
    userId: null,
    duration: 0,
    slot:  new Date(),
    status: 0,
    equipmentId: null,
    equipmentAmount: null,
    uniqueReservationId: null,
    totalPrice: null
  };
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
  private map!: Map;
  private marker!: Feature;

  searchQuery: string = '';

  isUpdateMode = false; 
  selectedEquipmentId: number | null = null; 
  showModal = false;
  newEquipment :  Equipment = {
    id: 0,
    name: '',
    description: '',
    isAvailable: false,
    companyId: 0,
    amount: 0,
    reservedAmount: 0,
    type: 0,
    price: 0
  };
  calendar: Calendar | undefined;
  constructor(
    private companyService: CompanyService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const companyId = this.tokenStorage.getCompanyId();
    if(companyId)
    {     
      this.loadCompanyData(companyId, this.viewMode);
    }
    
  }
  navigateToAnalytics(): void {
    this.router.navigate(['/analytics']);
  }
  loadCompanyData(id: number, viewMode: string): void {
    this.companyService.getById(id).subscribe(
      (data: Company) => {
        this.company = data;
        console.log(this.company);
  
        if (data.address.latitude && data.address.longitude) {
          if (!this.map) {
            this.initializeMap(data.address.latitude, data.address.longitude);
          }
        }

        this.loadCalendar(viewMode);
        
      },
      (error) => {
        console.error('Error fetching company data:', error);
        this.router.navigate(['home']); // Redirect to home if error
      }
    );
  }
  loadCalendar(viewMode: string) {
    if (this.company.appointments) {
      console.log(this.company.appointments);

      const eventPromises: Promise<EventInput>[] = this.company.appointments.map((appointment) => {
        return new Promise<EventInput>((resolve) => {
          const start = new Date(appointment.slot);
          const end = new Date(start.getTime() + appointment.duration * 60000); // Add duration (in minutes)

          const format12Hour = (date: Date) => {
            let hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const period = hours >= 12 ? 'p' : 'a';
            
            hours = hours % 12 || 12;
            
            return `${hours}:${minutes}${period}`;
          };

          const backgroundColor = appointment.status === 0 ? 'blue' : 'green';

          if (appointment.userId) {
            this.userService.getById(appointment.userId).subscribe((user) => {
              resolve({
                title: `- ${format12Hour(end)}, ${user.firstName} ${user.lastName}`,
                start: start,
                end: end,
                backgroundColor: backgroundColor,
                borderColor: backgroundColor,
                textColor: 'white',
                classNames: ['custom-event-class']
              });
            });
          } else {
            resolve({
              title: `- ${format12Hour(end)}`,
              start: start,
              end: end,
              backgroundColor: backgroundColor,
              borderColor: backgroundColor,
              textColor: 'white',
              classNames: ['custom-event-class']
            });
          }
        });
      });
      Promise.all(eventPromises).then((events: EventInput[]) => {
        this.calendarOptions = {
          plugins: [dayGridPlugin, timeGridPlugin], 
          initialView: viewMode,
          events: events,
          eventClick: this.handleEventClick.bind(this), 
        };
      });
    }
  }

  handleEventClick(arg: EventClickArg): void {
    console.log('Clicked event:', arg.event); // Prikazuje sve informacije o događaju u konzoli
  }
  initializeMap(lat: number, lon: number): void {
    this.map = new Map({
      target: this.mapElement.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([lon, lat]), // OpenLayers uses [longitude, latitude]
        zoom: 13
      })
    });

    this.marker = new Feature({
      geometry: new Point(fromLonLat([lon, lat])) // OpenLayers uses [longitude, latitude]
    });

    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png'
      })
    });

    this.marker.setStyle(markerStyle);

    const vectorSource = new VectorSource({
      features: [this.marker]
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    this.map.addLayer(vectorLayer);

    this.map.on('click', (event) => {
      const coordinates = toLonLat(event.coordinate);
      this.updateLocation(coordinates[1], coordinates[0]);
    });
  }

  deinitializeMap(): void {
    if (this.map) {
        this.map.setTarget(undefined);  
        this.map.getLayers().clear();
        this.map = null as any; 
        this.marker = null as any; 
    }
}

  updateLocation(lat: number, lon: number): void {
    this.company.address.latitude = lat;
    this.company.address.longitude = lon;

    this.marker.setGeometry(new Point(fromLonLat([lon, lat])));
    this.reverseGeocode(lat, lon);

  }
  reverseGeocode(latitude: number, longitude: number) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
      .then(response => response.json())
      .then(data => {
        const address = data.address;
        this.company.address.street = address.road || '';
        this.company.address.city = address.city || address.town || address.village || '';
        this.company.address.country = address.country || '';
      })
      .catch(error => console.error('Error during reverse geocoding:', error));
  }

  saveCompany(): void {
    this.companyService.update(this.company).subscribe(
      () => {
        alert('Company details updated successfully.');
      },
      (error) => {
        console.error('Error updating company details:', error);
      }
    );
  }
  openAddEquipmentDialog(): void {
    this.isUpdateMode = false;
    this.showModal = true;
    this.newEquipment = { id: 0,  name: '', description: '', isAvailable: false , companyId: 0, amount: 0, reservedAmount: 0, type: 0, price: 0};
  }
  saveEquipment(): void {
    if (this.isUpdateMode) {
      this.updateEquipment();
    } else {
      this.addEquipment();
    }
  }

  closeModal(): void {
    this.showModal = false;
  }
  openUpdateEquipmentDialog(equipment: any): void {
    this.isUpdateMode = true; 
    this.selectedEquipmentId = equipment.id;
    this.newEquipment = { ...equipment }; 
    console.log(this.newEquipment);
    this.showModal = true;
  }
  updateEquipment(): void {
    if (this.selectedEquipmentId !== null && this.newEquipment.name) {
      this.companyService.updateEquipment(this.company.id, this.newEquipment).subscribe(
        (response) => {
          if(this.company.equipmentList) 
          {
            const index = this.company.equipmentList.findIndex(e => e.id === this.selectedEquipmentId);
            if (index !== -1) {
              this.company.equipmentList[index] = { ...this.newEquipment };
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

  deleteEquipment(equipmentId: number) {
    this.companyService.isEquipmentReserved(equipmentId)
      .subscribe(
        (response) => {
          if(!response.isReserved) {
            console.log("Nije rezervisano");
            this.companyService.deleteEquipment(this.company.id, equipmentId)
            .subscribe(
              (response) => {
                console.log('Equipment created successfully', response);
                this.loadCompanyData(this.company.id, this.viewMode);
              },
            (error) => {
              console.error('Error updating company details:', error);
              }
            );
          } else {
            console.log("Nije rezervisano");
            alert("Cannot delete this equipment because there already is an appointment for it!");
          }
        },
        (error: any) => {
          console.error('Error checking if equipment is reserved', error);
        }
      );

  }
  addEquipment(): void {
    console.log(this.newEquipment);
    
    if (this.newEquipment.name) {
      
      this.companyService.addEquipment(this.company.id, this.newEquipment).subscribe(
        (response) => {
          console.log("Success", response);
          this.company.equipmentList = [];
          this.company.equipmentList.push(this.newEquipment);
          this.newEquipment = { id: 0,  name: '', description: '', isAvailable: false , companyId: 0, amount: 0, reservedAmount: 0, type: 0, price: 0};
          this.closeModal();
          this.deinitializeMap();
          this.loadCompanyData(this.company.id, this.viewMode);
          alert('Equipment added successfully!');
        },
        (error) => {
          console.error('Error adding equipment:', error);
        }
      );
    }
  }

  saveAppointment(): void {
    if (this.isAppointmentUpdateMode) {
      //this.updateAppointment();
    } else {
      this.addAppointment();
    }
  }
  addAppointment(): void {
    if (this.newAppointment) {
      console.log(this.newAppointment.administratorId)
      this.newAppointment.administratorId = Number(this.newAppointment.administratorId);
      this.companyService.addAppointment(this.company.id, this.newAppointment).subscribe(
        (response) => {
          console.log("Success", response);
          this.company.appointments = [];
          this.company.appointments.push(this.newAppointment);
          this.newAppointment= { companyId: 0,  administratorId: 0,userId: null, duration: 0, slot: new Date(), status: 0, equipmentId: null, equipmentAmount: null, uniqueReservationId: null, totalPrice: null};
          this.closeModal();
          this.deinitializeMap();
          this.loadCompanyData(this.company.id, this.viewMode);
        },
        (error) => {
          console.error('Error adding appointment:', error);
        }
      );
    }
  }
  /*updateAppointment(): void {
    if (this.selectedEquipmentId !== null && this.newEquipment.name) {
      this.companyService.updateEquipment(this.company.id, this.newEquipment).subscribe(
        (response) => {
          if(this.company.equipmentList) 
          {
            const index = this.company.equipmentList.findIndex(e => e.id === this.selectedEquipmentId);
            if (index !== -1) {
              this.company.equipmentList[index] = { ...this.newEquipment };
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
  }*/
  openAddAppointmentDialog() {
    this.isAppointmentUpdateMode = false;
    this.newAppointment = {companyId: 0 , administratorId: 0, userId: null, duration: 0, slot: new Date(), status: 0, equipmentId: null, equipmentAmount: null, uniqueReservationId: null, totalPrice: null };
    this.showAppointmentModal = true;
  }

  openUpdateAppointmentDialog(appointment: any) {
    this.isAppointmentUpdateMode = true;
    this.newAppointment = { ...appointment };
    this.showAppointmentModal = true;
  }

  closeAppointmentModal() {
    this.showAppointmentModal = false;
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  switchCalendarView(viewMode: string): void {
    console.log(viewMode);
    if (this.calendarOptions) {
      this.calendarOptions = undefined; 
      this.loadCalendar(viewMode);
    }
  }
  handleClick() {
    console.log("huh");
  }
}
