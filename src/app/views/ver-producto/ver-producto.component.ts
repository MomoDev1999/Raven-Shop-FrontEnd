import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-ver-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-producto.component.html',
  styleUrls: ['./ver-producto.component.css'],
})
export class VerProductoComponent implements OnInit {
  producto: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const productId = id ? +id : 0;
    this.productService.getProductoPorId(productId).subscribe((producto) => {
      this.producto = producto;
    });
  }

  agregarAlCarrito(producto: any): void {
    this.carritoService.agregarAlCarrito({
      ...producto,
      id: producto.id,
      quantity: 1,
    });
  }

  // Función para obtener estrellas llenas
  getStars(rate: number): number[] {
    return Array(Math.floor(rate)).fill(0);
  }

  // Función para obtener estrellas vacías
  getEmptyStars(rate: number): number[] {
    return Array(5 - Math.ceil(rate)).fill(0);
  }
}
