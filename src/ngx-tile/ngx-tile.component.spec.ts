import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTileComponent } from './ngx-tile.component';

describe('NgxTileComponent', () => {
  let component: NgxTileComponent;
  let fixture: ComponentFixture<NgxTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
