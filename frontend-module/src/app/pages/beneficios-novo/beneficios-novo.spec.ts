import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosNovo } from './beneficios-novo';

describe('BeneficiosNovo', () => {
  let component: BeneficiosNovo;
  let fixture: ComponentFixture<BeneficiosNovo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiosNovo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiosNovo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
