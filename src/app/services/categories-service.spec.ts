import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CategoriesService } from './categories-service.service';
import { HttpClient } from '@angular/common/http';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let httpMock: HttpTestingController;

  const mockCategories = [
    'Electronics',
    'Jewelery',
    "Men's clothing",
    "Women's clothing",
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
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load categories from API and update the BehaviorSubject', () => {
    service.categories$.subscribe((categories) => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(
      'https://fakestoreapi.com/products/categories'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should return categories as observable', (done) => {
    service.getCategories().subscribe((categories) => {
      expect(categories).toEqual(mockCategories);
      done();
    });

    const req = httpMock.expectOne(
      'https://fakestoreapi.com/products/categories'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });
});
