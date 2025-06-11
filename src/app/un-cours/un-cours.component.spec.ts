import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnCoursComponent } from './un-cours.component';

describe('UnCoursComponent', () => {
  let component: UnCoursComponent;
  let fixture: ComponentFixture<UnCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnCoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
