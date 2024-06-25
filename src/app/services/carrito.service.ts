import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface CarritoItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private carritoSubject: BehaviorSubject<CarritoItem[]> = new BehaviorSubject<
    CarritoItem[]
  >([]);
  public carrito$: Observable<CarritoItem[]> =
    this.carritoSubject.asObservable();

  constructor() {
    this.cargarCarrito();
  }

  private get localStorageAvailable(): boolean {
    try {
      const testKey = 'test';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  public cargarCarrito(): void {
    if (this.localStorageAvailable) {
      const carritoString = localStorage.getItem('carrito');
      if (carritoString) {
        this.carritoSubject.next(JSON.parse(carritoString));
      }
    }
  }

  private guardarCarrito(): void {
    if (this.localStorageAvailable) {
      localStorage.setItem(
        'carrito',
        JSON.stringify(this.carritoSubject.getValue())
      );
    }
  }

  agregarAlCarrito(producto: CarritoItem): void {
    const currentCarrito = this.carritoSubject.getValue();
    const itemIndex = currentCarrito.findIndex(
      (item) => item.id === producto.id
    );

    if (itemIndex > -1) {
      // Si el producto ya está en el carrito, incrementa su cantidad
      currentCarrito[itemIndex].quantity += producto.quantity;
    } else {
      // Si el producto no está en el carrito, agrégalo
      currentCarrito.push(producto);
    }

    this.carritoSubject.next(currentCarrito);
    this.guardarCarrito();
  }

  eliminarDelCarrito(producto: CarritoItem): void {
    const currentCarrito = this.carritoSubject
      .getValue()
      .filter((item) => item.id !== producto.id);
    this.carritoSubject.next(currentCarrito);
    this.guardarCarrito();
  }
}
