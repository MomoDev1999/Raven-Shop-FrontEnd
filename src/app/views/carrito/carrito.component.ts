import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';

interface CarritoItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
  carrito: CarritoItem[] = [];
  cantidadTotal: number = 0;

  constructor(private carritoService: CarritoService, private router: Router) {} // Inyecta el servicio

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.cargarCarrito();

      window.addEventListener('storage', () => {
        this.cargarCarrito();
      });
    }

    this.carritoService.carrito$.subscribe((carrito) => {
      this.carrito = carrito;
      this.cantidadTotal = this.carritoService.calcularCantidadTotal();
    });
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  cargarCarrito() {
    if (this.isBrowser()) {
      this.carritoService.cargarCarrito();
    }
  }

  eliminarDelCarrito(item: CarritoItem) {
    if (this.isBrowser()) {
      this.carritoService.eliminarDelCarrito(item);
      this.cargarCarrito();
    }
  }

  vaciarCarrito() {
    if (this.isBrowser()) {
      this.carritoService.vaciarCarrito();
    }
  }

  incrementarCantidad(item: CarritoItem) {
    if (this.isBrowser()) {
      this.carritoService.incrementarCantidad(item);
      this.cargarCarrito();
    }
  }

  decrementarCantidad(item: CarritoItem) {
    if (this.isBrowser()) {
      this.carritoService.decrementarCantidad(item);
      this.cargarCarrito();
    }
  }

  calcularTotal(): number {
    return this.carritoService.calcularTotal();
  }

  verMas(productId: number): void {
    this.router.navigate(['/ver-producto', productId]);
  }
}
