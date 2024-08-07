import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from 'src/app/shared/model/company';
import { environment } from 'src/env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.apiUrl}/companies`;


  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}`);
  }
  create(company: Company) : Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, company);
  } 
}
