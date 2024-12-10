import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerProductoComponent } from './ver-producto.component';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../services/carrito.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VerProductoComponent', () => {
  let component: VerProductoComponent;
  let fixture: ComponentFixture<VerProductoComponent>;
  let productServiceMock: any;
  let carritoServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // Mock del servicio de productos
    productServiceMock = {
      getProductoPorId: jasmine.createSpy('getProductoPorId').and.returnValue(
        of({
          id: 1,
          title: 'Producto Test',
          description: 'Descripción del producto',
          price: 100,
          image: 'image.jpg',
          rating: { rate: 4.5 },
        })
      ),
    };

    // Mock del servicio de carrito
    carritoServiceMock = {
      agregarAlCarrito: jasmine.createSpy('agregarAlCarrito'),
    };

    // Mock de ActivatedRoute
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1'), // Mock del ID del producto
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        VerProductoComponent, // Importamos el componente standalone
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: CarritoService, useValue: carritoServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el producto basado en el ID de la ruta', () => {
    const mockProducto = {
      id: 1,
      title: 'Producto Test',
      description: 'Descripción del producto',
      price: 100,
      image: 'image.jpg',
      rating: { rate: 4.5 },
    };
    productServiceMock.getProductoPorId.and.returnValue(of(mockProducto));

    component.ngOnInit();

    expect(activatedRouteMock.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(productServiceMock.getProductoPorId).toHaveBeenCalledWith(1);
    expect(component.producto).toEqual(mockProducto);
  });

  it('debería agregar el producto al carrito', () => {
    const mockProducto = {
      id: 1,
      title: 'Producto Test',
      description: 'Descripción del producto',
      price: 100,
      image: 'image.jpg',
      rating: { rate: 4.5 },
    };
    component.producto = mockProducto;

    component.agregarAlCarrito(mockProducto);

    expect(carritoServiceMock.agregarAlCarrito).toHaveBeenCalledWith({
      ...mockProducto,
      id: mockProducto.id,
      quantity: 1,
    });
  });

  it('debería retornar las estrellas llenas correctamente', () => {
    const stars = component.getStars(3.5);
    expect(stars.length).toBe(3);
  });

  it('debería retornar las estrellas vacías correctamente', () => {
    const emptyStars = component.getEmptyStars(3.5);
    expect(emptyStars.length).toBe(1);
  });

  it('debería manejar un producto no encontrado', () => {
    productServiceMock.getProductoPorId.and.returnValue(of(null));

    component.ngOnInit();

    expect(component.producto).toBeNull();
  });
});
