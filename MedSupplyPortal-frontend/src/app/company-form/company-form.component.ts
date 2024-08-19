import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { tileLayer, Marker, LatLng } from 'leaflet'; // Ovde se koristi Map iz leaflet biblioteke
import { Company } from '../shared/model/company';
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
import { CompanyService } from '../services/company/company.service';
import { Router } from '@angular/router';
import { User } from '../shared/model/user';



@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

  constructor(private companyService: CompanyService, private router: Router) {}

  @ViewChild('map', { static: true }) mapElement!: ElementRef;

  newCompany = {
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

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.map = new Map({
      target: this.mapElement.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([-122.4194, 37.7749]),
        zoom: 12
      })
    });

    this.marker = new Feature({
      geometry: new Point(fromLonLat([-122.4194, 37.7749]))
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

    this.map.on('click', (event: any) => {
      const clickedCoord = event.coordinate;
      this.marker.setGeometry(new Point(clickedCoord));
      const [longitude, latitude] = toLonLat(clickedCoord);
      this.newCompany.address.longitude = longitude;
      this.newCompany.address.latitude = latitude;
      this.reverseGeocode(latitude, longitude);
    });
  }

  reverseGeocode(latitude: number, longitude: number) {
    // Replace with your geocoding API endpoint
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
      .then(response => response.json())
      .then(data => {
        const address = data.address;
        this.newCompany.address.street = address.road || '';
        this.newCompany.address.city = address.city || address.town || address.village || '';
        this.newCompany.address.country = address.country || '';
      })
      .catch(error => console.error('Error during reverse geocoding:', error));
  }

  submitForm() {
    console.log('Form submitted with:', this.newCompany);
    this.companyService.create(this.newCompany).subscribe(
      response => {
        console.log("Uspesno kreiranje kompanije", response);
        this.router.navigate(['profile']);
      },
      (error) => {
        console.log("Greska", error);
      }
    );
  }
}