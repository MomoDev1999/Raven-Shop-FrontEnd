import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

interface CarritoItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  carrito: CarritoItem[] = [];
  cantidadTotal: number = 0;

  constructor(private router: Router, private carritoService: CarritoService) {}

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

  incrementQuantity(item: CarritoItem) {
    if (this.isBrowser()) {
      this.carritoService.incrementarCantidad(item);
      this.cargarCarrito();
    }
  }

  decrementQuantity(item: CarritoItem) {
    if (this.isBrowser()) {
      this.carritoService.decrementarCantidad(item);
      this.cargarCarrito();
    }
  }

  calcularTotal(): number {
    return this.carritoService.calcularTotal();
  }
}
