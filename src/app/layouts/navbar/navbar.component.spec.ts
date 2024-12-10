import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { CategoriesService } from '../../services/categories-service.service';
import { CarritoService } from '../../services/carrito.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockCategoriesService: jasmine.SpyObj<CategoriesService>;
  let mockCarritoService: Partial<CarritoService>;
  let carritoSubject: BehaviorSubject<any[]>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Inicializa el BehaviorSubject con un carrito vacío
    carritoSubject = new BehaviorSubject<any[]>([]);

    // Mock de CarritoService
    mockCarritoService = {
      carrito$: carritoSubject.asObservable(),
      calcularCantidadTotal: jasmine
        .createSpy('calcularCantidadTotal')
        .and.returnValue(0),
      cargarCarrito: jasmine.createSpy('cargarCarrito'),
      eliminarDelCarrito: jasmine.createSpy('eliminarDelCarrito'),
      calcularTotal: jasmine.createSpy('calcularTotal').and.returnValue(0),
    };

    // Mock de CategoriesService
    mockCategoriesService = jasmine.createSpyObj('CategoriesService', [
      'getCategories',
    ]);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NavbarComponent],
      providers: [
        { provide: CategoriesService, useValue: mockCategoriesService },
        { provide: CarritoService, useValue: mockCarritoService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar las categorías al inicializarse', () => {
    const mockCategories = ['electronics', 'jewelery', "men's clothing"];
    mockCategoriesService.getCategories.and.returnValue(of(mockCategories));

    component.ngOnInit();
    expect(component.categories).toEqual(mockCategories);
    expect(mockCategoriesService.getCategories).toHaveBeenCalled();
  });

  it('debería no buscar si el término de búsqueda está vacío', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.searchTerm = '';
    component.buscarProductos();

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('debería buscar productos cuando el término de búsqueda es válido', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.searchTerm = 'zapatos';
    component.buscarProductos();

    expect(navigateSpy).toHaveBeenCalledWith(['/buscar'], {
      queryParams: { termino: 'zapatos' },
    });
  });

  it('debería cerrar sesión y redirigir al índice', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    spyOn(localStorage, 'setItem');
    component.cerrarSesion();

    expect(localStorage.setItem).toHaveBeenCalledWith('loggedIn', 'false');
    expect(navigateSpy).toHaveBeenCalledWith(['/index']);
  });

  it('debería eliminar un producto del carrito', () => {
    const mockItem = {
      id: 1,
      title: 'Producto 1',
      price: 100,
      quantity: 1,
      image: 'img1.jpg',
    };

    component.eliminarDelCarrito(mockItem);

    expect(mockCarritoService.eliminarDelCarrito).toHaveBeenCalledWith(
      mockItem
    );
  });
});
