import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidesBarComponent } from './sides-bar.component';

describe('SidesBarComponent', () => {
  let component: SidesBarComponent;
  let fixture: ComponentFixture<SidesBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidesBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidesBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
