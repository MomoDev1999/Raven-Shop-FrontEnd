import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('#cargarProductos', () => {
    it('debería hacer una solicitud GET y actualizar productosSubject', () => {
      const mockProductos = [
        { id: 1, name: 'Producto 1' },
        { id: 2, name: 'Producto 2' },
      ];

      service.cargarProductos().subscribe((productos) => {
        expect(productos).toEqual(mockProductos);
      });

      const req = httpMock.expectOne('http://localhost:8080/productos');
      expect(req.request.method).toBe('GET');
      req.flush(mockProductos);

      service.getProductos().subscribe((productos) => {
        expect(productos).toEqual(mockProductos);
      });
    });
  });

  describe('#getProductoPorId', () => {
    it('debería devolver el producto correspondiente por su ID', () => {
      const mockProductos = [
        { id: 1, name: 'Producto 1' },
        { id: 2, name: 'Producto 2' },
      ];
      service['productosSubject'].next(mockProductos);

      service.getProductoPorId(1).subscribe((producto) => {
        expect(producto).toEqual({ id: 1, name: 'Producto 1' });
      });

      service.getProductoPorId(3).subscribe((producto) => {
        expect(producto).toBeUndefined();
      });
    });
  });

  describe('#buscarPorCategoria', () => {
    it('debería hacer una solicitud GET con los parámetros correctos', () => {
      const categoria = 'tecnología';
      const mockProductos = [{ id: 3, name: 'Laptop' }];

      service.buscarPorCategoria(categoria).subscribe((productos) => {
        expect(productos).toEqual(mockProductos);
      });

      const req = httpMock.expectOne(
        (request) =>
          request.url === 'http://localhost:8080/productos/search' &&
          request.params.get('keyword') === categoria
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockProductos);
    });
  });

  describe('#buscarProductos', () => {
    it('debería hacer una solicitud GET con los parámetros correctos', () => {
      const termino = 'smartphone';
      const mockProductos = [{ id: 4, name: 'Smartphone' }];

      service.buscarProductos(termino).subscribe((productos) => {
        expect(productos).toEqual(mockProductos);
      });

      const req = httpMock.expectOne(
        (request) =>
          request.url === 'http://localhost:8080/productos/search' &&
          request.params.get('keyword') === termino
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockProductos);
    });
  });
});
