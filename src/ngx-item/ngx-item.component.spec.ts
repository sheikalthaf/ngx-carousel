import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxItemComponent } from './ngx-item.component';

describe('NgxItemComponent', () => {
  let component: NgxItemComponent;
  let fixture: ComponentFixture<NgxItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
