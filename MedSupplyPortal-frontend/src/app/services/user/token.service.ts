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

    sessionStorage.removeItem(ACCESS_TOKEN);
    sessionStorage.removeItem(USER);
    sessionStorage.removeItem(COMPANY_ID);
    
    sessionStorage.setItem(ACCESS_TOKEN, token);
    sessionStorage.setItem(USER, userId.toString());
    if (companyId) {
      sessionStorage.setItem(COMPANY_ID, companyId.toString());
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN);
  }

  getCompanyId(): number | null {
    const companyIdString = sessionStorage.getItem(COMPANY_ID);
    return companyIdString ? parseInt(companyIdString, 10) : null;
  }

  getUserId(): number {
    const userIdString = sessionStorage.getItem(USER);
    return userIdString ? parseInt(userIdString, 10) : 0;
  }

  clear(): void {
    sessionStorage.removeItem(ACCESS_TOKEN);
    sessionStorage.removeItem(USER);
    sessionStorage.removeItem(COMPANY_ID);
  }
}
