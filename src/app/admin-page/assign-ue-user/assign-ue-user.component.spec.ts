import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignUeUserComponent } from './assign-ue-user.component';

describe('AssignUeUserComponent', () => {
  let component: AssignUeUserComponent;
  let fixture: ComponentFixture<AssignUeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignUeUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignUeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
