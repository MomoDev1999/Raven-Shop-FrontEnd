import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisComprasComponent } from './mis-compras.component';
import { MisComprasService, Compra } from '../../services/mis-compras.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

describe('MisComprasComponent', () => {
  let component: MisComprasComponent;
  let fixture: ComponentFixture<MisComprasComponent>;
  let misComprasServiceMock: any;

  beforeEach(async () => {
    // Mock del servicio
    misComprasServiceMock = {
      getMisCompras: jasmine.createSpy('getMisCompras'),
    };

    await TestBed.configureTestingModule({
      imports: [MisComprasComponent, CommonModule, FormsModule],
      providers: [
        { provide: MisComprasService, useValue: misComprasServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MisComprasComponent);
    component = fixture.componentInstance;

    // Espiar localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null); // Valor por defecto
    misComprasServiceMock.getMisCompras.and.returnValue(of([])); // Valor por defecto

    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar las compras si personaId está en localStorage', () => {
    const mockCompras: Compra[] = [
      {
        id: 1,
        producto: {
          id: 101,
          title: 'Producto 1',
          price: 1000,
          image: 'producto1.jpg',
        },
        cantidad: 2,
        fecha: '2024-12-09',
        estado: 'Completado',
      },
      {
        id: 2,
        producto: {
          id: 102,
          title: 'Producto 2',
          price: 1500,
          image: 'producto2.jpg',
        },
        cantidad: 1,
        fecha: '2024-12-08',
        estado: 'Pendiente',
      },
    ];

    (localStorage.getItem as jasmine.Spy).and.returnValue('1');
    misComprasServiceMock.getMisCompras.and.returnValue(of(mockCompras));

    component.ngOnInit();

    expect(misComprasServiceMock.getMisCompras).toHaveBeenCalledWith(1);
    expect(component.compras).toEqual(mockCompras);
  });

  it('debería no cargar compras si personaId no está en localStorage', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);

    component.ngOnInit();

    expect(misComprasServiceMock.getMisCompras).not.toHaveBeenCalled();
    expect(component.compras).toEqual([]);
  });

  it('debería manejar errores al cargar compras', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('1');
    misComprasServiceMock.getMisCompras.and.returnValue(
      throwError(() => new Error('Error de servidor'))
    );

    component.ngOnInit();

    expect(misComprasServiceMock.getMisCompras).toHaveBeenCalledWith(1);
    expect(component.compras).toEqual([]); // Comprueba que no se asignaron compras
  });

  it('debería mostrar alerta si personaId no está en localStorage', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);
    const swalSpy = spyOn(Swal, 'fire');

    component.ngOnInit();

    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'warning',
        title: 'No estás logueado',
        text: 'Inicia sesión para ver tus compras.',
      })
    );
  });

  it('debería mostrar alerta si ocurre un error al cargar compras', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('1');
    misComprasServiceMock.getMisCompras.and.returnValue(
      throwError(() => new Error('Error de servidor'))
    );
    const swalSpy = spyOn(Swal, 'fire');

    component.ngOnInit();

    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cargar tus compras.',
      })
    );
  });
});
