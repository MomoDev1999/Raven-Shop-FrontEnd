import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RecuperarPasswordComponent } from './recuperar-password.component';

describe('RecuperarPasswordComponent', () => {
  let component: RecuperarPasswordComponent;
  let fixture: ComponentFixture<RecuperarPasswordComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, RecuperarPasswordComponent], // Aquí se importa el componente standalone
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarPasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el email como una cadena vacía', () => {
    expect(component.email).toBe('');
  });

  it('debería mostrar un mensaje de error si el correo electrónico no es válido', () => {
    component.email = '';
    spyOn(console, 'log');
    component.enviarRecuperacion();

    expect(console.log).toHaveBeenCalledWith(
      'Por favor, ingrese un correo electrónico válido.'
    );
  });

  it('debería llamar a la función enviarRecuperacion y redirigir si el correo es válido', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.email = 'usuario@ejemplo.com';
    spyOn(console, 'log');

    component.enviarRecuperacion();

    expect(console.log).toHaveBeenCalledWith(
      'Correo de recuperación enviado a:',
      'usuario@ejemplo.com'
    );
    expect(navigateSpy).toHaveBeenCalledWith(['/mensaje-enviado']);
  });

  it('debería validar que el formulario es válido antes de enviar', () => {
    const emailInput = fixture.nativeElement.querySelector('#recuperar-email');
    const submitButton = fixture.nativeElement.querySelector('#recuperar-btn');

    emailInput.value = 'usuario@ejemplo.com';
    emailInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.email).toBe('usuario@ejemplo.com');
    submitButton.click();

    fixture.detectChanges();

    spyOn(router, 'navigate');
    expect(component.email).toBe('usuario@ejemplo.com');
  });
});
