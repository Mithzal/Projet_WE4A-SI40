import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUeComponent } from './edit-ue.component';

describe('EditUeComponent', () => {
  let component: EditUeComponent;
  let fixture: ComponentFixture<EditUeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
