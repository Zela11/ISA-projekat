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

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElement!: ElementRef;
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
    averageRating: 0,
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
    companyId: 0
  };

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
      this.loadCompanyData(companyId);
    }
  }

  loadCompanyData(id: number): void {
    this.companyService.getById(id).subscribe(
      (data: Company) => {
        this.company = data;
        console.log(this.company);
        if (data.address.latitude && data.address.longitude) {
          if(!this.map) {
          this.initializeMap(data.address.latitude, data.address.longitude);
          }
        }
      },
      (error) => {
        console.error('Error fetching company data:', error);
        this.router.navigate(['home']); // Redirect to home if error
      }
    );
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
    this.newEquipment = { id: 0,  name: '', description: '', isAvailable: false , companyId: 0};
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
    this.companyService.deleteEquipment(this.company.id, equipmentId)
      .subscribe(
        (response) => {
          console.log('Equipment created successfully', response);
          this.loadCompanyData(this.company.id);
        },
      (error) => {
        console.error('Error updating company details:', error);
        }
      );
  }
  addEquipment(): void {
    if (this.newEquipment.name) {
      this.companyService.addEquipment(this.company.id, this.newEquipment).subscribe(
        (response) => {
          console.log("Success", response);
          this.company.equipmentList = [];
          this.company.equipmentList.push(this.newEquipment);
          this.newEquipment = { id: 0,  name: '', description: '', isAvailable: false , companyId: 0};
          this.closeModal();
          this.deinitializeMap();
          this.loadCompanyData(this.company.id);
          alert('Equipment added successfully!');
        },
        (error) => {
          console.error('Error adding equipment:', error);
        }
      );
    }
  }
}
