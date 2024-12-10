import { TestBed } from '@angular/core/testing';
import { CarritoService } from './carrito.service';

describe('CarritoService', () => {
  let service: CarritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoService);
    localStorage.clear(); // Limpia el localStorage antes de cada prueba
    service.vaciarCarrito(); // Vacía el carrito al inicio de cada prueba
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería agregar un producto al carrito', () => {
    const producto = {
      id: 1,
      title: 'Producto 1',
      price: 10,
      quantity: 1,
      image: 'img1.jpg',
    };
    service.agregarAlCarrito(producto);

    service.carrito$.subscribe((carrito) => {
      expect(carrito.length).toBe(1);
      expect(carrito[0]).toEqual(producto);
    });
  });

  it('debería incrementar la cantidad de un producto existente en el carrito', () => {
    const producto = {
      id: 1,
      title: 'Producto 1',
      price: 10,
      quantity: 1,
      image: 'img1.jpg',
    };
    service.agregarAlCarrito(producto);
    service.incrementarCantidad(producto);

    service.carrito$.subscribe((carrito) => {
      expect(carrito[0].quantity).toBe(2);
    });
  });

  it('debería calcular el total del carrito', () => {
    const productos = [
      { id: 1, title: 'Producto 1', price: 10, quantity: 2, image: 'img1.jpg' },
      { id: 2, title: 'Producto 2', price: 20, quantity: 1, image: 'img2.jpg' },
    ];
    productos.forEach((producto) => service.agregarAlCarrito(producto));

    expect(service.calcularTotal()).toBe(40);
  });

  it('debería eliminar un producto del carrito', () => {
    const producto = {
      id: 1,
      title: 'Producto 1',
      price: 10,
      quantity: 1,
      image: 'img1.jpg',
    };
    service.agregarAlCarrito(producto);
    service.eliminarDelCarrito(producto);

    service.carrito$.subscribe((carrito) => {
      expect(carrito.length).toBe(0);
    });
  });

  it('no debería decrementar la cantidad por debajo de 1', () => {
    const producto = {
      id: 1,
      title: 'Producto 1',
      price: 10,
      quantity: 1,
      image: 'img1.jpg',
    };
    service.agregarAlCarrito(producto);
    service.decrementarCantidad(producto);

    service.carrito$.subscribe((carrito) => {
      expect(carrito[0].quantity).toBe(1);
    });
  });

  it('debería vaciar el carrito', () => {
    const producto = {
      id: 1,
      title: 'Producto 1',
      price: 10,
      quantity: 1,
      image: 'img1.jpg',
    };
    service.agregarAlCarrito(producto);
    service.vaciarCarrito();

    service.carrito$.subscribe((carrito) => {
      expect(carrito.length).toBe(0);
    });
  });
});
