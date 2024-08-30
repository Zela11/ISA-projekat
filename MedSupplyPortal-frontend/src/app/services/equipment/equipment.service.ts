import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipment } from 'src/app/shared/model/equipment';
import { environment } from 'src/env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrl = `${environment.apiUrl}/companies/equipments`;

  constructor(private http: HttpClient) { }
  getAllEquipment(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.apiUrl);
  }
}
