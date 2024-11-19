import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

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

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private http: HttpClient // Inyección de HttpClient para realizar la petición al backend
  ) {}

  realizarCompra(): void {
    // Verificar si el usuario está logueado
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const personaId = localStorage.getItem('loggedUserId');

    console.log(personaId);

    if (!loggedIn || !personaId) {
      Swal.fire({
        icon: 'warning',
        title: 'Debes iniciar sesión',
        text: 'Inicia sesión para poder realizar esta acción.',
        showCancelButton: true,
        confirmButtonText: 'Iniciar sesión',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirigir al inicio de sesión
          this.router.navigate(['/iniciar-sesion']);
        }
      });
      return; // Detener la ejecución si no hay usuario logueado
    }

    // Mostrar SweetAlert2 para confirmar la compra
    Swal.fire({
      title: '¿Confirmas tu compra?',
      text: `El total es ${this.calcularTotal().toFixed(2)}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, comprar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const compras = this.carrito.map((item) => ({
          persona: { id: personaId }, // Usar el ID del usuario logueado
          producto: { id: item.id },
          cantidad: item.quantity,
          fecha: new Date(),
        }));

        // Realizar la petición al backend
        this.http.post('http://localhost:8080/compras', compras).subscribe(
          (response) => {
            Swal.fire(
              '¡Compra realizada!',
              'Tu pedido ha sido procesado correctamente.',
              'success'
            );
            this.carritoService.vaciarCarrito();
          },
          (error) => {
            Swal.fire(
              'Error',
              'Ocurrió un problema al procesar tu pedido.',
              'error'
            );
          }
        );
      }
    });
  }

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
