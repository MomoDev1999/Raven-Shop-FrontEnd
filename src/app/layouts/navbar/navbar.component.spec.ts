import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CategoriesService } from '../../services/categories-service.service';
import { CarritoService } from '../../services/carrito.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let categoriesServiceStub: Partial<CategoriesService>;
  let carritoServiceStub: Partial<CarritoService>;

  beforeEach(async () => {
    categoriesServiceStub = {
      getCategories: () => of(['Electrónica', 'Ropa', 'Libros']),
    };

    carritoServiceStub = {
      carrito$: of([
        {
          id: 1,
          name: 'Producto 1',
          price: 10,
          quantity: 1,
          image: 'img1.jpg',
        },
        {
          id: 2,
          name: 'Producto 2',
          price: 20,
          quantity: 2,
          image: 'img2.jpg',
        },
      ]),
      cargarCarrito: jasmine.createSpy('cargarCarrito'),
      eliminarDelCarrito: jasmine.createSpy('eliminarDelCarrito'),
    };

    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [RouterTestingModule, FormsModule],
      providers: [
        { provide: CategoriesService, useValue: categoriesServiceStub },
        { provide: CarritoService, useValue: carritoServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch categories on init', () => {
    expect(component.categories.length).toBe(3);
    expect(component.categories).toEqual(['Electrónica', 'Ropa', 'Libros']);
  });

  it('should check login status on init', () => {
    spyOn(localStorage, 'getItem').and.returnValue('true');
    component.checkLoginStatus();
    expect(component.loggedIn).toBeTrue();
  });

  it('should load carrito on init', () => {
    expect(component.carrito.length).toBe(2);
  });

  it('should search products by category', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.buscarPorCategoria('Electrónica');
    expect(router.navigate).toHaveBeenCalledWith(['/buscar'], {
      queryParams: { categoria: 'Electrónica' },
    });
  });

  it('should search products by term', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.searchTerm = 'laptop';
    component.buscarProductos();
    expect(router.navigate).toHaveBeenCalledWith(['/buscar'], {
      queryParams: { termino: 'laptop' },
    });
  });

  it('should logout and navigate to index', () => {
    spyOn(localStorage, 'setItem');
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.cerrarSesion();
    expect(localStorage.setItem).toHaveBeenCalledWith('loggedIn', 'false');
    expect(component.loggedIn).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/index']);
  });

  it('should remove item from carrito', () => {
    const item = {
      id: 1,
      name: 'Producto 1',
      price: 10,
      quantity: 1,
      image: 'img1.jpg',
    };
    component.eliminarDelCarrito(item);
    expect(carritoServiceStub.eliminarDelCarrito).toHaveBeenCalledWith(item);
  });
});
