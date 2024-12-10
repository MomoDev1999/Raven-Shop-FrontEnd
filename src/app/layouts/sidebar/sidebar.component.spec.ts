import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { CarritoService } from '../../services/carrito.service';
import { of } from 'rxjs';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let carritoServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // Mock del servicio CarritoService
    carritoServiceMock = {
      carrito$: of([]),
      cargarCarrito: jasmine.createSpy('cargarCarrito'),
      calcularCantidadTotal: jasmine
        .createSpy('calcularCantidadTotal')
        .and.returnValue(0),
      eliminarDelCarrito: jasmine.createSpy('eliminarDelCarrito'),
      incrementarCantidad: jasmine.createSpy('incrementarCantidad'),
      decrementarCantidad: jasmine.createSpy('decrementarCantidad'),
      calcularTotal: jasmine.createSpy('calcularTotal').and.returnValue(0),
    };

    // Mock del Router
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    // Mock del ActivatedRoute
    activatedRouteMock = {
      snapshot: {
        paramMap: { get: jasmine.createSpy('get').and.returnValue('1') },
      },
    };

    await TestBed.configureTestingModule({
      imports: [SidebarComponent], // Componente standalone
      providers: [
        { provide: CarritoService, useValue: carritoServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el carrito al inicializarse', () => {
    component.ngOnInit();
    expect(carritoServiceMock.cargarCarrito).toHaveBeenCalled();
  });

  it('debería suscribirse al carrito$ y calcular la cantidad total', () => {
    const mockCarrito = [
      {
        id: 1,
        title: 'Producto 1',
        price: 100,
        quantity: 2,
        image: 'image1.jpg',
      },
    ];
    carritoServiceMock.carrito$ = of(mockCarrito);
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    expect(component.carrito).toEqual(mockCarrito);
    expect(carritoServiceMock.calcularCantidadTotal).toHaveBeenCalled();
  });

  it('debería eliminar un item del carrito', () => {
    const mockItem = {
      id: 1,
      title: 'Producto 1',
      price: 100,
      quantity: 2,
      image: 'image1.jpg',
    };
    component.eliminarDelCarrito(mockItem);
    expect(carritoServiceMock.eliminarDelCarrito).toHaveBeenCalledWith(
      mockItem
    );
    expect(carritoServiceMock.cargarCarrito).toHaveBeenCalled();
  });

  it('debería incrementar la cantidad de un item', () => {
    const mockItem = {
      id: 1,
      title: 'Producto 1',
      price: 100,
      quantity: 2,
      image: 'image1.jpg',
    };
    component.incrementQuantity(mockItem);
    expect(carritoServiceMock.incrementarCantidad).toHaveBeenCalledWith(
      mockItem
    );
    expect(carritoServiceMock.cargarCarrito).toHaveBeenCalled();
  });

  it('debería decrementar la cantidad de un item', () => {
    const mockItem = {
      id: 1,
      title: 'Producto 1',
      price: 100,
      quantity: 2,
      image: 'image1.jpg',
    };
    component.decrementQuantity(mockItem);
    expect(carritoServiceMock.decrementarCantidad).toHaveBeenCalledWith(
      mockItem
    );
    expect(carritoServiceMock.cargarCarrito).toHaveBeenCalled();
  });

  it('debería calcular el total correctamente', () => {
    const total = component.calcularTotal();
    expect(total).toBe(0);
    expect(carritoServiceMock.calcularTotal).toHaveBeenCalled();
  });

  it('debería navegar a la página del producto al llamar verMas', () => {
    const productId = 1;
    component.verMas(productId);
    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/ver-producto',
      productId,
    ]);
  });

  it('debería determinar correctamente si está en el navegador', () => {
    expect(component.isBrowser()).toBeTrue();
  });
});
