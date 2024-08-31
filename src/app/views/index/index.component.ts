import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../services/carrito.service';
import { SliceGroupsPipe } from './slice-groups.pipe';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, SliceGroupsPipe],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  productos: any[] = [];

  testimonials = [
    {
      review:
        'Excelente servicio y productos de alta calidad. Muy satisfecho con mi compra.',
      rate: 4.5,
      name: 'Juan Pérez',
      date: '10 de Julio, 2024',
    },
    {
      review: 'Entrega rápida y atención al cliente excepcional. ¡Recomendado!',
      rate: 5,
      name: 'María López',
      date: '5 de Junio, 2024',
    },
    {
      review:
        'Gran variedad de productos y precios competitivos. Muy satisfecho.',
      rate: 3,
      name: 'Carlos González',
      date: '20 de Mayo, 2024',
    },
    {
      review: 'Calidad y precio insuperables. Volveré a comprar aquí.',
      rate: 4,
      name: 'Laura Méndez',
      date: '15 de Marzo, 2024',
    },
    {
      review: 'Muy buena atención y productos de calidad. Recomendado.',
      rate: 3.5,
      name: 'Pedro Gómez',
      date: '30 de Abril, 2024',
    },
    {
      review: 'Muy satisfecho con mi compra. Atención al cliente excelente.',
      rate: 5,
      name: 'Ana Rodríguez',
      date: '12 de Febrero, 2024',
    },
    {
      review:
        'El producto llegó en perfectas condiciones y en el tiempo estimado. Todo excelente.',
      rate: 4,
      name: 'Luis Martínez',
      date: '28 de Enero, 2024',
    },
    {
      review:
        'La tienda ofrece una experiencia de compra muy agradable. El sitio web es fácil de navegar.',
      rate: 4.5,
      name: 'Sofía Olave',
      date: '8 de Diciembre, 2023',
    },
  ];

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

  formatPrice(price: string): string {
    return Number(price).toLocaleString('es-CL');
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return rating % 1 > 0 ? [0] : [];
  }
}
