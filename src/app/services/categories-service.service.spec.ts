import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CategoriesService } from './categories-service.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let httpMock: HttpTestingController;

  const mockApiUrl = 'https://fakestoreapi.com/products/categories';
  const mockCategories = [
    'electronics',
    'jewelery',
    "men's clothing",
    "women's clothing",
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoriesService],
    });

    service = TestBed.inject(CategoriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden solicitudes pendientes
  });

  it('debería crearse', fakeAsync(() => {
    const req = httpMock.expectOne(mockApiUrl);
    req.flush(mockCategories); // Simula la respuesta de la API
    tick(); // Resuelve el flujo asíncrono
    expect(service).toBeTruthy();
  }));

  it('debería cargar las categorías al inicializarse', (done) => {
    // Simula la suscripción al Observable
    service.categories$.subscribe((categories) => {
      if (categories.length > 0) {
        expect(categories).toEqual(mockCategories);
        done(); // Finaliza la prueba
      }
    });

    // Simula la solicitud HTTP y su respuesta
    const req = httpMock.expectOne(mockApiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('debería retornar las categorías mediante getCategories', fakeAsync(() => {
    const req = httpMock.expectOne(mockApiUrl);
    req.flush(mockCategories); // Responde a la carga inicial
    tick();

    service.getCategories().subscribe((categories) => {
      expect(categories).toEqual(mockCategories);
    });
  }));
});
