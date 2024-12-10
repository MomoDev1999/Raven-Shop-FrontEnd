import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoComponent } from './carrito.component';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('CarritoComponent', () => {
  let component: CarritoComponent;
  let fixture: ComponentFixture<CarritoComponent>;
  let carritoServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    carritoServiceMock = {
      carrito$: of([]),
      cargarCarrito: jasmine.createSpy('cargarCarrito'),
      eliminarDelCarrito: jasmine.createSpy('eliminarDelCarrito'),
      vaciarCarrito: jasmine.createSpy('vaciarCarrito'),
      incrementarCantidad: jasmine.createSpy('incrementarCantidad'),
      decrementarCantidad: jasmine.createSpy('decrementarCantidad'),
      calcularTotal: jasmine.createSpy('calcularTotal').and.returnValue(0),
      calcularCantidadTotal: jasmine
        .createSpy('calcularCantidadTotal')
        .and.returnValue(0),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [CarritoComponent, HttpClientTestingModule], // Importa el componente independiente
      providers: [
        { provide: CarritoService, useValue: carritoServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el carrito al inicializar', () => {
    expect(carritoServiceMock.cargarCarrito).toHaveBeenCalled();
  });

  it('debería eliminar un producto del carrito', () => {
    const mockItem = {
      id: 1,
      title: 'Producto',
      price: 10,
      quantity: 1,
      image: 'img.jpg',
    };
    component.eliminarDelCarrito(mockItem);
    expect(carritoServiceMock.eliminarDelCarrito).toHaveBeenCalledWith(
      mockItem
    );
  });

  it('debería vaciar el carrito', () => {
    component.vaciarCarrito();
    expect(carritoServiceMock.vaciarCarrito).toHaveBeenCalled();
  });

  it('debería incrementar la cantidad de un producto', () => {
    const mockItem = {
      id: 1,
      title: 'Producto',
      price: 10,
      quantity: 1,
      image: 'img.jpg',
    };
    component.incrementarCantidad(mockItem);
    expect(carritoServiceMock.incrementarCantidad).toHaveBeenCalledWith(
      mockItem
    );
  });

  it('debería decrementar la cantidad de un producto', () => {
    const mockItem = {
      id: 1,
      title: 'Producto',
      price: 10,
      quantity: 1,
      image: 'img.jpg',
    };
    component.decrementarCantidad(mockItem);
    expect(carritoServiceMock.decrementarCantidad).toHaveBeenCalledWith(
      mockItem
    );
  });

  it('debería calcular el total correctamente', () => {
    component.calcularTotal();
    expect(carritoServiceMock.calcularTotal).toHaveBeenCalled();
  });

  it('debería navegar a la página de detalles de producto al llamar a verMas', () => {
    component.verMas(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/ver-producto', 1]);
  });

  it('debería mostrar alerta si no hay sesión al realizar compra', async () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const swalSpy = spyOn(Swal, 'fire').and.callFake(() =>
      Promise.resolve({
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
        value: null,
      })
    );

    component.realizarCompra();

    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'warning',
        title: 'Debes iniciar sesión',
      })
    );
  });
});
