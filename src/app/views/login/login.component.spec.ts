import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerStub: Partial<Router>;

  beforeEach(async () => {
    routerStub = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, CommonModule, FormsModule],
      providers: [{ provide: Router, useValue: routerStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when fields are empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should show error message when username is not provided', () => {
    component.loginForm.controls['password'].setValue('password');
    component.onSubmit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.error-message').textContent).toContain(
      'Usuario es requerido.'
    );
  });

  it('should show error message when password is not provided', () => {
    component.loginForm.controls['username'].setValue('user1');
    component.onSubmit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.error-message').textContent).toContain(
      'Contraseña es requerida.'
    );
  });

  it('should login successfully with valid credentials', () => {
    component.loginForm.controls['username'].setValue('user1');
    component.loginForm.controls['password'].setValue('password1');
    component.onSubmit();
    expect(localStorage.getItem('loggedIn')).toBe('true');
    expect(routerStub.navigate).toHaveBeenCalledWith(['/index']);
  });

  it('should show login error with invalid credentials', () => {
    component.loginForm.controls['username'].setValue('invalidUser');
    component.loginForm.controls['password'].setValue('invalidPassword');
    component.onSubmit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.error-message').textContent).toContain(
      'Usuario o contraseña incorrectos.'
    );
    expect(component.loginError).toBeTrue();
  });

  it('should display error message when form is invalid', () => {
    component.onSubmit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.error-message')).toBeTruthy();
  });

  it('should navigate to register page when "No tengo cuenta" button is clicked', () => {
    const button = fixture.debugElement.query(
      By.css('#no-cuenta')
    ).nativeElement;
    button.click();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/registrar']);
  });

  it('should navigate to forgot password page when "He olvidado mi contraseña" button is clicked', () => {
    const button = fixture.debugElement.query(
      By.css('#olvide-password')
    ).nativeElement;
    button.click();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/recuperar-password']);
  });
});
