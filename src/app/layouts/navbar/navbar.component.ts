import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories-service.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';

interface CarritoItem {
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

    this.checkLoginStatus();
    this.cargarCarrito();

    window.addEventListener('storage', () => {
      this.checkLoginStatus();
    });

    this.carritoService.carrito$.subscribe((carrito) => {
      this.carrito = carrito;
    });
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
    localStorage.setItem('loggedIn', 'false');
    this.checkLoginStatus();
    this.router.navigate(['/index']);
  }

  checkLoginStatus() {
    const status = localStorage.getItem('loggedIn');
    this.loggedIn = status === 'true';
  }

  cargarCarrito() {
    this.carritoService.cargarCarrito();
  }

  eliminarDelCarrito(item: CarritoItem) {
    this.carritoService.eliminarDelCarrito(item);
  }
}
