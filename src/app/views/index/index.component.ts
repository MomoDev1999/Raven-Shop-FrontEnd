import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  productos: any[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.productService.getProductos().subscribe(
      (productos) => {
        this.productos = productos;
      },
      (error) => {
        console.error('Error al cargar los productos:', error);
      }
    );
  }

  verMas(productId: number): void {
    this.router.navigate(['/ver-producto', productId]);
  }

  agregarAlCarrito(producto: any): void {
    this.carritoService.agregarAlCarrito({
      ...producto,
      id: producto.id,
      quantity: 1,
    });
  }
}
