import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheCoursComponent } from './recherche-cours.component';

describe('RechercheCoursComponent', () => {
  let component: RechercheCoursComponent;
  let fixture: ComponentFixture<RechercheCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechercheCoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RechercheCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
