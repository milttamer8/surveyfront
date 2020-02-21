import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportpollComponent } from './reportpoll.component';

describe('ReportpollComponent', () => {
  let component: ReportpollComponent;
  let fixture: ComponentFixture<ReportpollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportpollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportpollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
