import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentGradingComponent } from './assignment-grading.component';

describe('AssignementGradingComponent', () => {
  let component: AssignmentGradingComponent;
  let fixture: ComponentFixture<AssignmentGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentGradingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
