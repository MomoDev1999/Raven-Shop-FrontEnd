import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarComponent } from './buscar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../services/carrito.service';
import { of } from 'rxjs';

describe('BuscarComponent', () => {
  let component: BuscarComponent;
  let fixture: ComponentFixture<BuscarComponent>;
  let productServiceMock: any;
  let carritoServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // Mocks para servicios
    productServiceMock = {
      buscarPorCategoria: jasmine
        .createSpy('buscarPorCategoria')
        .and.returnValue(of([])),
      buscarProductos: jasmine
        .createSpy('buscarProductos')
        .and.returnValue(of([])),
    };

    carritoServiceMock = {
      agregarAlCarrito: jasmine.createSpy('agregarAlCarrito'),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    activatedRouteMock = {
      queryParams: of({ categoria: 'electronicos', termino: 'smartphone' }),
    };

    await TestBed.configureTestingModule({
      imports: [BuscarComponent], // Componente standalone
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: CarritoService, useValue: carritoServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializarse con productos por categoría', () => {
    component.ngOnInit();
    expect(productServiceMock.buscarPorCategoria).toHaveBeenCalledWith(
      'electronicos'
    );
    expect(component.productos).toEqual([]); // Lista vacía porque el mock retorna []
  });

  it('debería inicializarse con productos por término de búsqueda', () => {
    // Simula el caso donde no hay categoría pero sí término
    activatedRouteMock.queryParams = of({ termino: 'smartphone' });
    fixture = TestBed.createComponent(BuscarComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    expect(productServiceMock.buscarProductos).toHaveBeenCalledWith(
      'smartphone'
    );
    expect(component.productos).toEqual([]); // Lista vacía porque el mock retorna []
  });

  it('debería manejar el caso de no tener categoría ni término', () => {
    activatedRouteMock.queryParams = of({});
    fixture = TestBed.createComponent(BuscarComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    expect(component.productos).toEqual([]);
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
    const mockProducto = { id: 1, name: 'Producto 1', price: 100 };
    component.agregarAlCarrito(mockProducto);
    expect(carritoServiceMock.agregarAlCarrito).toHaveBeenCalledWith({
      ...mockProducto,
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
