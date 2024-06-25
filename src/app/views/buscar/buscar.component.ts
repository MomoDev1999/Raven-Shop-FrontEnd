import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
})
export class BuscarComponent implements OnInit {
  productos: any[] = [];
  searchTerm: string = '';
  categoria: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.categoria = params['categoria'];
      this.searchTerm = params['termino'];

      if (this.categoria) {
        this.productService
          .buscarPorCategoria(this.categoria)
          .subscribe((productos) => {
            this.productos = productos;
          });
      } else if (this.searchTerm) {
        this.productService
          .buscarProductos(this.searchTerm)
          .subscribe((productos) => {
            this.productos = productos;
          });
      } else {
        this.productos = [];
      }
    });
  }

  verMas(productId: number): void {
    this.router.navigate(['/ver-producto', productId]);
  }

  agregarAlCarrito(producto: any): void {
    this.carritoService.agregarAlCarrito({ ...producto, quantity: 1 });
  }
}
