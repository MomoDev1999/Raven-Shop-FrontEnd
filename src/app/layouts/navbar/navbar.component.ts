import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories-service.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';
import Swal from 'sweetalert2';

interface CarritoItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  cantidadTotal: number = 0;
  categories: string[] = [];
  loggedIn: boolean = false;
  carrito: CarritoItem[] = [];
  searchTerm: string = '';

  mujerItems: string[] = ['Item1', 'Item2', 'Item3'];
  hombreItems: string[] = ['ropa para hombres', 'Item5', 'Item6'];
  calzadoItems: string[] = ['Item7', 'Item8', 'Item9'];
  accesoriosItems: string[] = ['joyería', 'Item11', 'Item12'];
  preventaItems: string[] = ['Item13', 'Item14', 'Item15'];

  constructor(
    private categoriesService: CategoriesService,
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );

    if (this.isBrowser()) {
      this.checkLoginStatus();
      this.cargarCarrito();

      window.addEventListener('storage', () => {
        this.checkLoginStatus();
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

  buscarPorCategoria(category: string): void {
    this.router.navigate(['/buscar'], { queryParams: { categoria: category } });
  }

  buscarProductos(): void {
    if (this.searchTerm.trim() !== '') {
      this.router.navigate(['/buscar'], {
        queryParams: { termino: this.searchTerm },
      });
    } else {
      Swal.fire('Error', 'Por favor, ingresa un término de búsqueda', 'error');
    }
  }

  cerrarSesion(): void {
    if (this.isBrowser()) {
      localStorage.setItem('loggedIn', 'false');
      localStorage.setItem('loggedUser', '');
      localStorage.setItem('loggedUserId', '');
      this.checkLoginStatus();
      this.router.navigate(['/index']);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Sesión cerrada exitosamente',
      });
    }
  }

  checkLoginStatus(): void {
    if (this.isBrowser()) {
      const status = localStorage.getItem('loggedIn');
      this.loggedIn =
        status === 'true' && localStorage.getItem('loggedUser') !== '';
    }
  }

  cargarCarrito(): void {
    if (this.isBrowser()) {
      this.carritoService.cargarCarrito();
      window.dispatchEvent(new Event('storage'));
    }
  }

  eliminarDelCarrito(item: CarritoItem): void {
    if (this.isBrowser()) {
      this.carritoService.eliminarDelCarrito(item);
      window.dispatchEvent(new Event('storage'));
    }
  }

  calcularTotal(): number {
    return this.carritoService.calcularTotal();
  }

  // Adicional: Método para formatear precios
  formatPrice(price: number): string {
    return price.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  }
}
