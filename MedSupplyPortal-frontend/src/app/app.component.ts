import { Component, HostListener } from '@angular/core';
import { TokenStorageService } from './services/user/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MedSupplyPortal-frontend';

  constructor(private tokenStorage: TokenStorageService) {}

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.tokenStorage.clear();
  }
}
