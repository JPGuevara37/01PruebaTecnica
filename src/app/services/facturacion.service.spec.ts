import { TestBed } from '@angular/core/testing';

import { FacturacionService } from './facturacion.service';

describe('FacturacionService', () => {
  let service: FacturacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
