import { Injectable } from '@angular/core';
import { ACCESS_TOKEN, USER } from 'src/app/shared/constants';
@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  saveToken(token: string, userId: number): void {
    console.log("u token storageu");
    console.log(token);
    console.log(userId);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USER);
    localStorage.setItem(ACCESS_TOKEN, token);
    localStorage.setItem(USER, userId.toString());
  }

  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  getUserId(): number {
    const userIdString = localStorage.getItem(USER);
    return userIdString ? parseInt(userIdString, 10) : 0;
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USER);
  }
}
