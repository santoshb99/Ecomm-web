import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByProductComponent } from './by-product.component';

describe('ByProductComponent', () => {
  let component: ByProductComponent;
  let fixture: ComponentFixture<ByProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
