import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservedEquipmentComponent } from './reserved-equipment.component';

describe('ReservedEquipmentComponent', () => {
  let component: ReservedEquipmentComponent;
  let fixture: ComponentFixture<ReservedEquipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservedEquipmentComponent]
    });
    fixture = TestBed.createComponent(ReservedEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
