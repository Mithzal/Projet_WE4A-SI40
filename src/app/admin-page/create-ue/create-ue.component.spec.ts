import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUeComponent } from './create-ue.component';

describe('CreateUeComponent', () => {
  let component: CreateUeComponent;
  let fixture: ComponentFixture<CreateUeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
