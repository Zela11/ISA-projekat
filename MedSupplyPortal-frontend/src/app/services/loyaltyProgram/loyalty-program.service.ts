import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/enviroment';
import { CategoryScale } from 'src/app/shared/model/categoryScale';
import { LoyaltyProgram } from 'src/app/shared/model/loyaltyProgram';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyProgramService {
  private apiUrl = `${environment.apiUrl}/loyaltyProgram`; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  createLoyaltyProgram(data: { pointsPerPickup: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  addCategoryScale(scale: { name: string, minimumPoints: number, penaltyThreshold: number, discount: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/addCategoryScale`, scale);
  }
  getLoyaltyProgram(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
  deleteLoyaltyProgram(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteLoyaltyProgram`);
  }
  deleteCategoryScale(categoryName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categoryScale/${categoryName}`);
  }
  editCategoryScale(category: CategoryScale): Observable<CategoryScale> {
    return this.http.put<CategoryScale>(`${this.apiUrl}/updateCategoryScale`, category);
  }
}
