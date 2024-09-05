import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from 'src/app/shared/model/company';
import { environment } from 'src/env/enviroment';
import { TokenStorageService } from '../user/token.service';
import { Equipment } from 'src/app/shared/model/equipment';
import { Appointment } from 'src/app/shared/model/appointment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  private apiUrl = `${environment.apiUrl}/companies`;


  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}`);
  }
  create(company: Company) : Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, company);
  } 
  getById(id: number) : Observable<Company> {
    console.log("u company servicu ", id);
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }
  update(company: Company): Observable<any> {
    return this.http.put(`${this.apiUrl}/${company.id}`, company);
  }
  addEquipment(companyId: number, equipment: Equipment) : Observable<any> {
    return this.http.post(`${this.apiUrl}/${companyId}/equipment`, equipment);
  }
  updateEquipment(companyId: number, equipment: Equipment) : Observable<any> {
    return this.http.put(`${this.apiUrl}/${companyId}/equipment/${equipment.id}`, equipment);
  }
  deleteEquipment(companyId: number, equipmentId: number) : Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${companyId}/equipment/${equipmentId}`);
  }
  updateEquipmentAmount(companyId: number, equipment: Equipment) : Observable<any> {
    console.log("U update appointmentu sam u servicu na frontu");

    return this.http.put(`${this.apiUrl}/${companyId}/equipmentAmount/${equipment.id}`, equipment);
  }
  addAppointment(companyId: number, appointment: Appointment) : Observable<any> {
    console.log(appointment)
    return this.http.post(`${this.apiUrl}/${companyId}/appointment`, appointment);
  }
  reserveAppointment(companyId: number ,appointment: Appointment) : Observable<any> {
    return this.http.put(`${this.apiUrl}/${companyId}/appointment`, appointment);
  }
  completeAppointment(companyId: number ,appointment: Appointment) : Observable<any> {
    console.log("U complemete appointmentu sam u servicu na frontu");
    return this.http.put(`${this.apiUrl}/${companyId}/completeAppointment`, appointment);
  }
  isEquipmentReserved(equipmentId: number): Observable<{ isReserved: boolean }> {
    return this.http.get<{ isReserved: boolean }>(`${this.apiUrl}/${equipmentId}/isReserved`);
  }
}
