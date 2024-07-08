import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarComponent } from './buscar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../services/carrito.service';

describe('BuscarComponent', () => {
  let component: BuscarComponent;
  let fixture: ComponentFixture<BuscarComponent>;
  let mockActivatedRoute: { queryParams: any };
  let mockRouter: { navigate: any };
  let productServiceStub: Partial<ProductService>;
  let carritoServiceStub: Partial<CarritoService>;

  const mockProductos = [
    {
      id: 1,
      title: 'Producto 1',
      category: 'Electronics',
      price: 100,
      image: 'img1.jpg',
    },
    {
      id: 2,
      title: 'Producto 2',
      category: 'Jewelery',
      price: 200,
      image: 'img2.jpg',
    },
  ];

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({ categoria: 'Electronics' }), // Puedes cambiar esto según lo que necesites probar
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    productServiceStub = {
      buscarPorCategoria: jasmine
        .createSpy('buscarPorCategoria')
        .and.returnValue(of(mockProductos)),
      buscarProductos: jasmine
        .createSpy('buscarProductos')
        .and.returnValue(of(mockProductos)),
    };

    carritoServiceStub = {
      agregarAlCarrito: jasmine.createSpy('agregarAlCarrito'),
    };

    await TestBed.configureTestingModule({
      declarations: [BuscarComponent],
      imports: [CommonModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ProductService, useValue: productServiceStub },
        { provide: CarritoService, useValue: carritoServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products by category on init', () => {
    expect(productServiceStub.buscarPorCategoria).toHaveBeenCalledWith(
      'Electronics'
    );
    expect(component.productos.length).toBe(2);
    expect(component.productos).toEqual(mockProductos);
  });

  it('should navigate to product details on verMas', () => {
    component.verMas(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/ver-producto', 1]);
  });

  it('should add product to cart on agregarAlCarrito', () => {
    const producto = {
      id: 1,
      title: 'Producto 1',
      category: 'Electronics',
      price: 100,
      image: 'img1.jpg',
    };
    component.agregarAlCarrito(producto);
    expect(carritoServiceStub.agregarAlCarrito).toHaveBeenCalledWith({
      ...producto,
      quantity: 1,
    });
  });

  it('should load products by search term on init', () => {
    mockActivatedRoute.queryParams = of({ termino: 'Producto' });
    fixture = TestBed.createComponent(BuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(productServiceStub.buscarProductos).toHaveBeenCalledWith('Producto');
    expect(component.productos.length).toBe(2);
    expect(component.productos).toEqual(mockProductos);
  });
});
