import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MisComprasService, Compra } from './mis-compras.service';

describe('MisComprasService', () => {
  let service: MisComprasService;
  let httpMock: HttpTestingController;

  const mockApiUrl = 'http://localhost:8080/compras/persona';
  const mockCompras: Compra[] = [
    {
      id: 1,
      producto: {
        id: 101,
        title: 'Producto 1',
        price: 100,
        image: 'imagen1.jpg',
      },
      cantidad: 2,
      fecha: '2024-12-09',
      estado: 'Entregado',
    },
    {
      id: 2,
      producto: {
        id: 102,
        title: 'Producto 2',
        price: 200,
        image: 'imagen2.jpg',
      },
      cantidad: 1,
      fecha: '2024-12-08',
      estado: 'Pendiente',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MisComprasService],
    });

    service = TestBed.inject(MisComprasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener las compras de una persona', () => {
    const personaId = 1;

    service.getMisCompras(personaId).subscribe((compras) => {
      expect(compras).toEqual(mockCompras);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/${personaId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCompras); // Simula la respuesta del servidor
  });
});
