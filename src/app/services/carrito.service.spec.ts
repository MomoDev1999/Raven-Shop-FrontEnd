import { TestBed } from '@angular/core/testing';
import { CarritoService } from './carrito.service';
import { BehaviorSubject } from 'rxjs';

interface CarritoItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

describe('CarritoService', () => {
  let service: CarritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoService);

    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load carrito from localStorage', () => {
    const mockCarrito: CarritoItem[] = [
      { id: 1, name: 'Producto 1', price: 10, quantity: 1, image: 'img1.jpg' },
    ];
    localStorage.setItem('carrito', JSON.stringify(mockCarrito));
    service.cargarCarrito();

    service.carrito$.subscribe((carrito) => {
      expect(carrito.length).toBe(1);
      expect(carrito).toEqual(mockCarrito);
    });
  });

  it('should add item to carrito', () => {
    const newItem: CarritoItem = {
      id: 1,
      name: 'Producto 1',
      price: 10,
      quantity: 1,
      image: 'img1.jpg',
    };

    service.agregarAlCarrito(newItem);

    service.carrito$.subscribe((carrito) => {
      expect(carrito.length).toBe(1);
      expect(carrito[0]).toEqual(newItem);
    });
  });

  it('should increment quantity if item already exists', () => {
    const existingItem: CarritoItem = {
      id: 1,
      name: 'Producto 1',
      price: 10,
      quantity: 1,
      image: 'img1.jpg',
    };
    service.agregarAlCarrito(existingItem);

    const newItem: CarritoItem = {
      id: 1,
      name: 'Producto 1',
      price: 10,
      quantity: 2,
      image: 'img1.jpg',
    };
    service.agregarAlCarrito(newItem);

    service.carrito$.subscribe((carrito) => {
      expect(carrito.length).toBe(1);
      expect(carrito[0].quantity).toBe(3); // 1 + 2 = 3
    });
  });

  it('should remove item from carrito', () => {
    const item1: CarritoItem = {
      id: 1,
      name: 'Producto 1',
      price: 10,
      quantity: 1,
      image: 'img1.jpg',
    };
    const item2: CarritoItem = {
      id: 2,
      name: 'Producto 2',
      price: 20,
      quantity: 1,
      image: 'img2.jpg',
    };
    service.agregarAlCarrito(item1);
    service.agregarAlCarrito(item2);

    service.eliminarDelCarrito(item1);

    service.carrito$.subscribe((carrito) => {
      expect(carrito.length).toBe(1);
      expect(carrito[0]).toEqual(item2);
    });
  });

  it('should handle localStorage not available', () => {
    spyOn(localStorage, 'setItem').and.throwError(
      'LocalStorage is not available'
    );
    spyOn(localStorage, 'getItem').and.throwError(
      'LocalStorage is not available'
    );

    expect(service['localStorageAvailable']).toBeFalse();
  });
});
