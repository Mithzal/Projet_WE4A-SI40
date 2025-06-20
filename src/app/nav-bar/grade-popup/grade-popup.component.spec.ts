import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradePopupComponent } from './grade-popup.component';

describe('GradePopupComponent', () => {
  let component: GradePopupComponent;
  let fixture: ComponentFixture<GradePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
