import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProductos = [
    { id: 1, title: 'Producto 1', category: 'Electronics', price: 100 },
    { id: 2, title: 'Producto 2', category: 'Jewelery', price: 200 },
    { id: 3, title: 'Producto 3', category: "Men's clothing", price: 50 },
    { id: 4, title: 'Producto 4', category: "Women's clothing", price: 150 },
  ];

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load products from API and update the BehaviorSubject', () => {
    service.productos$.subscribe((productos) => {
      expect(productos).toEqual(mockProductos);
    });

    const req = httpMock.expectOne('https://fakestoreapi.com/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProductos);
  });

  it('should return products as observable', (done) => {
    service.getProductos().subscribe((productos) => {
      expect(productos).toEqual(mockProductos);
      done();
    });

    const req = httpMock.expectOne('https://fakestoreapi.com/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProductos);
  });

  it('should return product by ID', (done) => {
    service['productosSubject'].next(mockProductos);

    service.getProductoPorId(1).subscribe((producto) => {
      expect(producto).toEqual(mockProductos[0]);
      done();
    });
  });

  it('should search products by category', (done) => {
    service['productosSubject'].next(mockProductos);

    service.buscarPorCategoria('Electronics').subscribe((productos) => {
      expect(productos.length).toBe(1);
      expect(productos[0].category).toBe('Electronics');
      done();
    });
  });

  it('should search products by term', (done) => {
    service['productosSubject'].next(mockProductos);

    service.buscarProductos('Producto 1').subscribe((productos) => {
      expect(productos.length).toBe(1);
      expect(productos[0].title).toBe('Producto 1');
      done();
    });
  });
});
