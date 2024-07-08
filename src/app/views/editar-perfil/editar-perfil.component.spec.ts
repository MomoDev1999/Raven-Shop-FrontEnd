import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPerfilComponent } from './editar-perfil.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('EditarPerfilComponent', () => {
  let component: EditarPerfilComponent;
  let fixture: ComponentFixture<EditarPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarPerfilComponent],
      imports: [CommonModule, FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate the form as valid', () => {
    component.username = 'testUser';
    component.phone = '12345678';
    component.firstname = 'Test';
    component.lastname = 'User';
    component.birthdate = '2000-01-01';
    component.email = 'test@example.com';
    component.address = '123 Main St';
    component.passwordActual = 'currentPass';
    component.password = 'newPass';
    component.confirmPassword = 'newPass';

    expect(component.isFormValid()).toBeTrue();
  });

  it('should validate phone as invalid', () => {
    component.phone = '1234';
    expect(component.isPhoneValid()).toBeFalse();
  });

  it('should validate email as invalid', () => {
    component.email = 'invalidEmail';
    expect(component.isEmailValid()).toBeFalse();
  });

  it('should validate password as invalid', () => {
    component.password = '123';
    expect(component.isPasswordValid()).toBeFalse();
  });

  it('should check password mismatch', () => {
    component.password = 'newPass';
    component.confirmPassword = 'differentPass';
    expect(component.validarEditar()).toBeFalse();
    expect(component.passwordMismatch).toBeTrue();
  });

  it('should show error message for empty username', () => {
    component.username = '';
    fixture.detectChanges();
    component.validarEditar();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.error-message').textContent).toContain(
      'Usuario es requerido y debe tener al menos 3 caracteres.'
    );
  });

  it('should display success message on valid edit', () => {
    spyOn(window, 'alert');
    component.username = 'testUser';
    component.phone = '12345678';
    component.firstname = 'Test';
    component.lastname = 'User';
    component.birthdate = '2000-01-01';
    component.email = 'test@example.com';
    component.address = '123 Main St';
    component.passwordActual = 'currentPass';
    component.password = 'newPass';
    component.confirmPassword = 'newPass';

    component.validarEditar();

    expect(window.alert).toHaveBeenCalledWith('Perfil editado correctamente.');
  });
});
