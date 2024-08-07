import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminProfileComponent } from './system-admin-profile.component';

describe('SystemAdminProfileComponent', () => {
  let component: SystemAdminProfileComponent;
  let fixture: ComponentFixture<SystemAdminProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SystemAdminProfileComponent]
    });
    fixture = TestBed.createComponent(SystemAdminProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
