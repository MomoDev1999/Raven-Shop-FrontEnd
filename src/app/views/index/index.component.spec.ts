import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndexComponent } from './index.component';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;
  let productServiceMock: any;
  let carritoServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    productServiceMock = {
      cargarProductos: jasmine
        .createSpy('cargarProductos')
        .and.returnValue(of([])),
      getProductos: jasmine.createSpy('getProductos').and.returnValue(of([])),
    };

    carritoServiceMock = {
      agregarAlCarrito: jasmine.createSpy('agregarAlCarrito'),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [IndexComponent, HttpClientTestingModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: CarritoService, useValue: carritoServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar productos al inicializarse', () => {
    component.ngOnInit();
    expect(productServiceMock.cargarProductos).toHaveBeenCalled();
    expect(productServiceMock.getProductos).toHaveBeenCalled();
  });

  it('debería navegar al producto correcto al llamar verMas', () => {
    const productId = 42;
    component.verMas(productId);
    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/ver-producto',
      productId,
    ]);
  });

  it('debería agregar un producto al carrito', () => {
    const mockProducto = { id: 1, title: 'Producto 1', price: 100 };
    component.agregarAlCarrito(mockProducto);
    expect(carritoServiceMock.agregarAlCarrito).toHaveBeenCalledWith({
      ...mockProducto,
      id: mockProducto.id,
      quantity: 1,
    });
  });

  it('debería formatear correctamente los precios', () => {
    const formattedPrice = component.formatPrice('12345');
    expect(formattedPrice).toBe('12.345');
  });

  it('debería calcular correctamente las estrellas llenas', () => {
    const stars = component.getStars(4.5);
    expect(stars.length).toBe(4);
  });

  it('debería calcular correctamente las estrellas vacías', () => {
    const emptyStars = component.getEmptyStars(4.5);
    expect(emptyStars.length).toBe(1);
  });

  it('debería manejar correctamente el caso sin estrellas vacías', () => {
    const emptyStars = component.getEmptyStars(5);
    expect(emptyStars.length).toBe(0);
  });
});
