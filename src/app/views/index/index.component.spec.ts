import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndexComponent } from './index.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../services/carrito.service';
import { By } from '@angular/platform-browser';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;
  let productServiceStub: Partial<ProductService>;
  let carritoServiceStub: Partial<CarritoService>;
  let routerStub: Partial<Router>;

  const mockProductos = [
    { id: 1, title: 'Producto 1', price: 100, image: 'img1.jpg' },
    { id: 2, title: 'Producto 2', price: 200, image: 'img2.jpg' },
  ];

  beforeEach(async () => {
    productServiceStub = {
      getProductos: jasmine
        .createSpy('getProductos')
        .and.returnValue(of(mockProductos)),
    };

    carritoServiceStub = {
      agregarAlCarrito: jasmine.createSpy('agregarAlCarrito'),
    };

    routerStub = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      declarations: [IndexComponent],
      imports: [CommonModule],
      providers: [
        { provide: ProductService, useValue: productServiceStub },
        { provide: CarritoService, useValue: carritoServiceStub },
        { provide: Router, useValue: routerStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    component.ngOnInit();
    expect(productServiceStub.getProductos).toHaveBeenCalled();
    expect(component.productos).toEqual(mockProductos);
  });

  it('should navigate to product details on verMas', () => {
    component.verMas(1);
    expect(routerStub.navigate).toHaveBeenCalledWith(['/ver-producto', 1]);
  });

  it('should add product to carrito on agregarAlCarrito', () => {
    const producto = {
      id: 1,
      title: 'Producto 1',
      price: 100,
      image: 'img1.jpg',
    };
    component.agregarAlCarrito(producto);
    expect(carritoServiceStub.agregarAlCarrito).toHaveBeenCalledWith({
      ...producto,
      id: producto.id,
      quantity: 1,
    });
  });

  it('should display products in the template', () => {
    component.productos = mockProductos;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const productElements = compiled.querySelectorAll('.card');
    expect(productElements.length).toBe(2);
    expect(
      productElements[0].querySelector('.card-title').textContent
    ).toContain('Producto 1');
    expect(
      productElements[1].querySelector('.card-title').textContent
    ).toContain('Producto 2');
  });

  it('should call verMas when "Ver más" button is clicked', () => {
    spyOn(component, 'verMas');
    component.productos = mockProductos;
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('.ver-mas-btn')
    ).nativeElement;
    button.click();

    expect(component.verMas).toHaveBeenCalledWith(1);
  });

  it('should call agregarAlCarrito when "Agregar al carrito" button is clicked', () => {
    spyOn(component, 'agregarAlCarrito');
    component.productos = mockProductos;
    fixture.detectChanges();

    const button = fixture.debugElement.queryAll(By.css('.btn-primary'))[0]
      .nativeElement;
    button.click();

    expect(component.agregarAlCarrito).toHaveBeenCalledWith(mockProductos[0]);
  });
});
