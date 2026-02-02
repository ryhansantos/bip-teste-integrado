import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosTransferir } from './beneficios-transferir';

describe('BeneficiosTransferir', () => {
  let component: BeneficiosTransferir;
  let fixture: ComponentFixture<BeneficiosTransferir>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiosTransferir]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiosTransferir);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
