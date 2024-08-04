import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/env/enviroment';
import { TokenStorageService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {
    const savedUser = this.tokenStorage.getUserId();
    this.currentUserSubject = new BehaviorSubject<any>(savedUser);
    this.currentUser = this.currentUserSubject.asObservable();
   }
  private apiUrl = `${environment.apiUrl}/users`; // API URL


  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) : Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
 
  }
  handleLoginResponse(response: any): void {
    this.tokenStorage.saveToken(response.token, response.userId);
    this.currentUserSubject.next(response.userId);

  }
  logout() {
    this.tokenStorage.clear();
    this.currentUserSubject.next(null);
  }

  register(email: string, firstname: string, lastname: string, password: string ): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, firstname, lastname, password });

  }
}
