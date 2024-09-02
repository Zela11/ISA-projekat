import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../shared/model/company';
import { CompanyService } from '../services/company/company.service';
import { Appointment } from '../shared/model/appointment';
import { Equipment } from '../shared/model/equipment';
import { TokenStorageService } from '../services/user/token.service';
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
import { Calendar, CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventInput } from '@fullcalendar/core'; 
import { UserService } from '../services/user/user.service';
import { aD } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElement!: ElementRef;

  calendarOptions: CalendarOptions | undefined;
  viewMode: string = 'dayGridMonth'; 
  showPopup: boolean = false;
  selectedEvent: Appointment | null = null;
  selectedAmount: number = 1;
  private map!: Map;
  private marker!: Feature;

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
    reservedAmount: 0,
    type: 0
  };
  userId: number | null = null;

  constructor(    private userService: UserService, 
    private route: ActivatedRoute, private companyService: CompanyService, private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    this.loadCompany();
  }
  selectEquipment(equipment: Equipment): void {
    this.selectedEquipment = equipment;
    console.log(this.selectEquipment);
    this.selectedAmount = 1;
  }

  loadCompany() {
    var viewMode = this.viewMode;
    const companyId = Number(this.route.snapshot.paramMap.get('id'));
    this.companyService.getById(companyId).subscribe((data: Company) => {
      this.company = data;
      if (data.address.latitude && data.address.longitude) {
        if (!this.map) {
          this.initializeMap(data.address.latitude, data.address.longitude);
        }
      }
      this.filterAvailableAppointments();
      this.showAppointments = false;
      this.loadCalendar(viewMode);

    });
    this.userId = this.tokenStorage.getUserId();
  }
  getAvailableAmount(equipment: any): number {
    return equipment.amount - equipment.reservedAmount;
  }
  loadCalendar(viewMode: string) {
    if (this.company.appointments) {

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
                title: `- ${format12Hour(end)}`,
                start: start,
                end: end,
                backgroundColor: backgroundColor,
                borderColor: backgroundColor,
                textColor: 'white',
                classNames: ['custom-event-class'],
                extendedProps: {
                  uniqueIdentifier: `${appointment.slot}-${appointment.companyId}-${appointment.administratorId}`
                }

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
              classNames: ['custom-event-class'],
              extendedProps: {
                uniqueIdentifier: `${appointment.slot}-${appointment.companyId}-${appointment.administratorId}`
              }
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
    const uniqueIdentifier = arg.event.extendedProps['uniqueIdentifier'];
  
    const lastDashIndex = uniqueIdentifier.lastIndexOf('-');
    const secondLastDashIndex = uniqueIdentifier.lastIndexOf('-', lastDashIndex - 1);
  
    const slot = uniqueIdentifier.substring(0, secondLastDashIndex);
    const adminId = uniqueIdentifier.substring(lastDashIndex + 1);
  
    if(this.company.appointments){
      this.company.appointments.forEach((appointment) => {
        if(appointment.administratorId == adminId && appointment.slot == slot) {
          this.selectedEvent = appointment;
        }
      });
      
    }
    console.log(this.selectedEvent);

    if(this.selectedEvent?.userId) {
      alert("Ovaj termin je vec zakazan od strane drugog korisnika");
    } else {
      this.showPopup = true;
    }


  }
  closePopup(): void {
    this.showPopup = false;
    this.selectedEvent = null;
  }
  reserveSelectedEquipment(): void {
    console.log("kada rez",this.selectedEquipment);
    console.log("kada rez",this.selectedEvent);

    
    if(this.selectedEquipment.id != 0) {
      if(this.selectedEvent) {
        this.selectedEvent.userId = this.userId;
        this.selectedEvent.equipmentAmount = this.selectedAmount;
        this.selectedEvent.uniqueReservationId = this.generateReservationId();
        this.selectedEvent.equipmentId = this.selectedEquipment?.id;
        this.companyService.reserveAppointment(this.company?.id ,this.selectedEvent).subscribe(
          () => {
            this.closePopup();
            this.selectedEquipment.reservedAmount += this.selectedAmount;
            this.companyService.updateEquipmentAmount(this.company.id, this.selectedEquipment).subscribe(
              (response) => {
                if(this.company.equipmentList) 
                {
                  const index = this.company.equipmentList.findIndex(e => e.id === this.selectedEquipment.id);
                  if (index !== -1) {
                    this.company.equipmentList[index] = { ...this.selectedEquipment };
                  }
                }
              
                this.closePopup();
              },
              (error) => {
                console.error('Error updating equipment:', error);
              }
            );
            this.loadCompany();
            alert('Appointment reserved successfully')
          },
          (error: any) => {
            console.error('Error updating appointment:', error);
          }
        )
      }
    } else {
      alert("First select equipment you would like to reserve");
    }
  }
  // ----------------- PAPIJEVO---------------------
  filterAvailableAppointments(): void {
    this.availableAppointments = this.company?.appointments?.filter(appointment => appointment.status === 0)
    console.log(this.availableAppointments)
  }
 
  generateReservationId(length: number = 8): string {
    return Math.random().toString(36).substr(2, length) + Date.now().toString(36); // Generates a unique ID
  }
  // ----------------- PAPIJEVO---------------------


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
  switchCalendarView(viewMode: string): void {
    console.log(viewMode);
    if (this.calendarOptions) {
      this.calendarOptions = undefined; 
      this.loadCalendar(viewMode);
    }
  }
}

