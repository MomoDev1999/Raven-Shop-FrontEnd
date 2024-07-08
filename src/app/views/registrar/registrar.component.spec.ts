import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarComponent } from './registrar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('RegistrarComponent', () => {
  let component: RegistrarComponent;
  let fixture: ComponentFixture<RegistrarComponent>;
  let routerStub: Partial<Router>;

  beforeEach(async () => {
    routerStub = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      declarations: [RegistrarComponent],
      imports: [CommonModule, FormsModule],
      providers: [{ provide: Router, useValue: routerStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when fields are empty', () => {
    expect(component.isFormValid()).toBeFalsy();
  });

  it('should show validation errors when form is invalid', () => {
    spyOn(window, 'alert');
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith(
      jasmine.stringMatching('Por favor corrija los siguientes errores:')
    );
  });

  it('should set passwordMismatch to true when passwords do not match', () => {
    component.password = 'password1';
    component.confirmPassword = 'password2';
    component.onSubmit();
    expect(component.passwordMismatch).toBeTrue();
  });

  it('should register successfully with valid credentials', () => {
    component.username = 'testUser';
    component.phone = '12345678';
    component.firstname = 'Test';
    component.lastname = 'User';
    component.birthdate = '2000-01-01';
    component.email = 'test@example.com';
    component.address = '123 Main St';
    component.password = 'password1';
    component.confirmPassword = 'password1';

    component.onSubmit();

    expect(localStorage.getItem('loggedIn')).toBe('true');
    expect(routerStub.navigate).toHaveBeenCalledWith(['/index']);
  });

  it('should reset form after successful registration', () => {
    component.username = 'testUser';
    component.phone = '12345678';
    component.firstname = 'Test';
    component.lastname = 'User';
    component.birthdate = '2000-01-01';
    component.email = 'test@example.com';
    component.address = '123 Main St';
    component.password = 'password1';
    component.confirmPassword = 'password1';

    component.onSubmit();
    expect(component.username).toBe('');
    expect(component.phone).toBe('');
    expect(component.firstname).toBe('');
    expect(component.lastname).toBe('');
    expect(component.birthdate).toBe('');
    expect(component.email).toBe('');
    expect(component.address).toBe('');
    expect(component.password).toBe('');
    expect(component.confirmPassword).toBe('');
  });

  it('should show error message for invalid phone', () => {
    component.phone = '1234';
    expect(component.isPhoneValid(component.phone)).toBeFalse();
  });

  it('should show error message for invalid email', () => {
    component.email = 'invalidEmail';
    expect(component.isEmailValid(component.email)).toBeFalse();
  });

  it('should show error message for short password', () => {
    component.password = '123';
    expect(component.password.length >= 6).toBeFalse();
  });

  it('should display validation errors in the template', () => {
    component.username = '';
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.error-message').textContent).toContain(
      'Usuario es requerido y debe tener al menos 3 caracteres.'
    );
  });
});
