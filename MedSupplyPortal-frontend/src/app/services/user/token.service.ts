import { Injectable } from '@angular/core';
import { ACCESS_TOKEN, COMPANY_ID, USER } from 'src/app/shared/constants';
@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  saveToken(token: string, userId: number, companyId: number): void {
    console.log("u token storageu");
    console.log(token);
    console.log(userId);
    console.log(companyId);

  
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USER);
    localStorage.removeItem(COMPANY_ID);
    
    localStorage.setItem(ACCESS_TOKEN, token);
    localStorage.setItem(USER, userId.toString());
    if(companyId)
    {
      localStorage.setItem(COMPANY_ID, companyId.toString());
    }

  }

  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  getCompanyId(): number | null {
    const companyIdString = localStorage.getItem(COMPANY_ID);
    return companyIdString ? parseInt(companyIdString, 10) : null;
  }


  getUserId(): number {
    const userIdString = localStorage.getItem(USER);
    return userIdString ? parseInt(userIdString, 10) : 0;
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USER);
    localStorage.removeItem(COMPANY_ID);
  }
}
