import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensajeEnviadoComponent } from './mensaje-enviado.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('MensajeEnviadoComponent', () => {
  let component: MensajeEnviadoComponent;
  let fixture: ComponentFixture<MensajeEnviadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajeEnviadoComponent, RouterTestingModule, FormsModule], // Agregamos módulos necesarios
    }).compileComponents();

    fixture = TestBed.createComponent(MensajeEnviadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería validar correctamente el código si es correcto', () => {
    const spyLog = spyOn(console, 'log'); // Espiamos el console.log para verificar los mensajes

    component.codigo = '12345'; // Código correcto
    component.validarCodigo();

    expect(spyLog).toHaveBeenCalledWith('Código validado correctamente');
  });

  it('debería mostrar un mensaje de error si el código es incorrecto', () => {
    const spyLog = spyOn(console, 'log');

    component.codigo = '54321'; // Código incorrecto
    component.validarCodigo();

    expect(spyLog).toHaveBeenCalledWith(
      'Código incorrecto. Por favor, inténtelo nuevamente.'
    );
  });

  it('debería marcar el formulario como inválido si el código no cumple con el patrón', () => {
    const input = fixture.nativeElement.querySelector('#codigo-recuperacion');
    input.value = 'abcd'; // Código no válido
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.codigo).toBe('abcd');
    const invalidFeedback =
      fixture.nativeElement.querySelector('.invalid-feedback');
    expect(invalidFeedback).not.toBeNull();
  });

  it('debería tener un botón de validación habilitado solo si el código cumple con el patrón', () => {
    const button = fixture.nativeElement.querySelector('#validar-codigo-btn');

    // Código válido
    component.codigo = '12345';
    fixture.detectChanges();
    expect(button.disabled).toBeFalse();

    // Código no válido
    component.codigo = '12';
    fixture.detectChanges();
    expect(button.disabled).toBeTrue();
  });
});
