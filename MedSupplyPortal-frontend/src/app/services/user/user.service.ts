import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/env/enviroment';
import { TokenStorageService } from './token.service';
import { User } from 'src/app/shared/model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {
    const userId = this.tokenStorage.getUserId();
    this.currentUserSubject = new BehaviorSubject<any>(userId);
    this.currentUser = this.currentUserSubject.asObservable();
    if (userId) {
      this.getById(userId).subscribe(
        (user: User) => {
          this.currentUserSubject.next(user);
        },
        (error) => {
          console.error('Error fetching user', error);
        }
      );
    }
  }
  private apiUrl = `${environment.apiUrl}/users`; // API URL


  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) : Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
 
  }
  handleLoginResponse(response: any): void {
    console.log(response);
    this.tokenStorage.saveToken(response.token, response.userId, response.companyId);
    this.getById(response.userId).subscribe(
      (user: User) => {
        this.currentUserSubject.next(user);
      },
      (error) => {
        console.error('Error fetching user after login', error);
      }
    );
  }
  logout() {
    this.tokenStorage.clear();
    this.currentUserSubject.next(null);
  }

  register(user: User): Observable<any> {
    console.log(user.userType);
    return this.http.post(`${this.apiUrl}/register`, user);

  }
  getById(id: number) : Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  getSystemAdmins() : Observable<User[]> {
    const token = this.tokenStorage.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User[]>(`${this.apiUrl}/getSystemAdmins`, {headers});
  }
  update(user: User): Observable<any> {
    console.log(user);
    return this.http.put(`${this.apiUrl}/${this.tokenStorage.getUserId()}`, user);
  }
  updatePenalty(user: User, userId: Number): Observable<any> {
    console.log(user);
    return this.http.put(`${this.apiUrl}/${userId}`, user);
  }
  updatePoints(user: User, userId: Number): Observable<any> {
    console.log(user);
    return this.http.put(`${this.apiUrl}/${userId}`, user);
  }
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const passwordChangeDto = { currentPassword, newPassword };
    return this.http.put(`${this.apiUrl}/${this.tokenStorage.getUserId()}/change-password`, passwordChangeDto);
  }
  deleteCategoryNames(): Observable<any> {
    return this.http.put(`${this.apiUrl}/deleteAllCategoryNames`, {});
  }
  updateUserCategories(): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateUserCategories`, {});
  }
  getUsersWithEquipmentReservationForCompany(companyId: number) : Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getUsers/${companyId}`);
  }

}
