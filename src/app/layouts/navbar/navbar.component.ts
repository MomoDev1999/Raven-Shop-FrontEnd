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
  name: string;
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
  categories: string[] = [];
  loggedIn: boolean = false;
  carrito: CarritoItem[] = [];
  searchTerm: string = '';

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
    });
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  buscarPorCategoria(category: string): void {
    this.router.navigate(['/buscar'], { queryParams: { categoria: category } });
  }

  buscarProductos() {
    this.router.navigate(['/buscar'], {
      queryParams: { termino: this.searchTerm },
    });
  }

  cerrarSesion() {
    if (this.isBrowser()) {
      localStorage.setItem('loggedIn', 'false');
      localStorage.setItem('loggedUser', 'username');
      this.checkLoginStatus();
      this.router.navigate(['/index']);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Sesión cerrada exitosamente',
      });
    }
  }

  checkLoginStatus() {
    if (this.isBrowser()) {
      const status = localStorage.getItem('loggedIn');
      this.loggedIn = status === 'true';
    }
  }

  cargarCarrito() {
    if (this.isBrowser()) {
      this.carritoService.cargarCarrito();
      window.dispatchEvent(new Event('storage'));
    }
  }

  eliminarDelCarrito(item: CarritoItem) {
    if (this.isBrowser()) {
      this.carritoService.eliminarDelCarrito(item);
      window.dispatchEvent(new Event('storage'));
    }
  }
}
