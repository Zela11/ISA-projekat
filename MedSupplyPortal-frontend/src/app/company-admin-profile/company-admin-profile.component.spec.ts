import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAdminProfileComponent } from './company-admin-profile.component';

describe('CompanyAdminProfileComponent', () => {
  let component: CompanyAdminProfileComponent;
  let fixture: ComponentFixture<CompanyAdminProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyAdminProfileComponent]
    });
    fixture = TestBed.createComponent(CompanyAdminProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
