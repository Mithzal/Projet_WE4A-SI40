import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsfeedCardComponent } from './newsfeed-card.component';

describe('NewsfeedCardComponent', () => {
  let component: NewsfeedCardComponent;
  let fixture: ComponentFixture<NewsfeedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsfeedCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsfeedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
