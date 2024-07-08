import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoComponent } from './carrito.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CarritoItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

describe('CarritoComponent', () => {
  let component: CarritoComponent;
  let fixture: ComponentFixture<CarritoComponent>;

  const mockCarrito: CarritoItem[] = [
    {
      id: 1,
      name: 'Producto 1',
      price: 20,
      quantity: 1,
      image: 'assets/img/producto_1.jpg',
    },
    {
      id: 2,
      name: 'Producto 2',
      price: 30,
      quantity: 2,
      image: 'assets/img/producto_2.jpg',
    },
    {
      id: 3,
      name: 'Producto 3',
      price: 60,
      quantity: 3,
      image: 'assets/img/producto_3.jpg',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarritoComponent],
      imports: [CommonModule, FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarritoComponent);
    component = fixture.componentInstance;
    localStorage.clear();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load carrito from localStorage on init', () => {
    localStorage.setItem('carrito', JSON.stringify(mockCarrito));
    component.cargarCarrito();
    fixture.detectChanges();
    expect(component.carrito.length).toBe(3);
    expect(component.carrito).toEqual(mockCarrito);
  });

  it('should remove item from carrito', () => {
    component.carrito = [...mockCarrito];
    const itemToRemove = mockCarrito[0];
    component.eliminarDelCarrito(itemToRemove);
    fixture.detectChanges();
    expect(component.carrito.length).toBe(2);
    expect(
      component.carrito.find((item) => item.id === itemToRemove.id)
    ).toBeUndefined();
  });

  it('should clear the carrito', () => {
    component.carrito = [...mockCarrito];
    component.vaciarCarrito();
    fixture.detectChanges();
    expect(component.carrito.length).toBe(0);
  });

  it('should display empty cart message when no items in carrito', () => {
    component.carrito = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p.text-center').textContent).toContain(
      'No hay productos en el carrito.'
    );
  });

  it('should display cart items when carrito has items', () => {
    component.carrito = [...mockCarrito];
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('.cart-item').length).toBe(3);
  });
});
