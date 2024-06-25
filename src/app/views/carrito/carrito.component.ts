import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CarritoItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent implements OnInit {
  carrito: CarritoItem[] = [];

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito() {
    const carritoString = localStorage.getItem('carrito');
    if (carritoString) {
      this.carrito = JSON.parse(carritoString);
    } else {
      this.carrito = [
        {
          name: 'Producto 1',
          price: 20,
          quantity: 1,
          image: 'assets/img/producto_1.jpg',
        },
        {
          name: 'Producto 2',
          price: 30,
          quantity: 2,
          image: 'assets/img/producto_2.jpg',
        },
        {
          name: 'Producto 3',
          price: 60,
          quantity: 3,
          image: 'assets/img/producto_3.jpg',
        },
      ];
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
  }

  eliminarDelCarrito(item: CarritoItem) {
    this.carrito = this.carrito.filter((i) => i !== item);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  vaciarCarrito() {
    this.carrito = [];
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }
}
