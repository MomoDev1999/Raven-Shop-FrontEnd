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
    private http: HttpClient
  ) {}

  realizarCompra(): void {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const personaId = localStorage.getItem('loggedUserId');

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
          this.router.navigate(['/iniciar-sesion']);
        }
      });
      return;
    }

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
          persona: { id: personaId },
          producto: { id: item.id },
          cantidad: item.quantity,
          fecha: new Date(),
        }));

        this.http.post('http://localhost:8080/compras', compras).subscribe(
          () => {
            Swal.fire(
              '¡Compra realizada!',
              'Tu pedido ha sido procesado correctamente.',
              'success'
            );
            this.carritoService.vaciarCarrito();
          },
          () => {
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
    this.cargarCarrito();
    this.carritoService.carrito$.subscribe((carrito) => {
      this.carrito = carrito;
      this.cantidadTotal = this.carritoService.calcularCantidadTotal();
    });
  }

  cargarCarrito() {
    this.carritoService.cargarCarrito();
  }

  eliminarDelCarrito(item: CarritoItem) {
    this.carritoService.eliminarDelCarrito(item);
  }

  vaciarCarrito() {
    this.carritoService.vaciarCarrito();
  }

  incrementarCantidad(item: CarritoItem) {
    this.carritoService.incrementarCantidad(item);
  }

  decrementarCantidad(item: CarritoItem) {
    this.carritoService.decrementarCantidad(item);
  }

  calcularTotal(): number {
    return this.carritoService.calcularTotal();
  }

  verMas(productId: number): void {
    this.router.navigate(['/ver-producto', productId]);
  }
}
