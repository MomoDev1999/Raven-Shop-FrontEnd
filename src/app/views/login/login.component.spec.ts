import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    loginServiceMock = {
      loginUser: jasmine.createSpy('loginUser'),
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule, // Simula el enrutador y soluciona problemas de RouterLink
      ],
      providers: [{ provide: LoginService, useValue: loginServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería marcar el formulario como inválido si los campos están vacíos', () => {
    component.loginForm.setValue({ username: '', password: '' });
    expect(component.loginForm.valid).toBeFalse();
  });

  it('debería establecer loginError a true si el formulario es inválido al enviar', () => {
    component.loginForm.setValue({ username: '', password: '' });
    component.onSubmit();
    expect(component.loginError).toBeTrue();
  });

  it('debería intentar iniciar sesión si el formulario es válido', () => {
    component.loginForm.setValue({
      username: 'testuser',
      password: 'password',
    });
    loginServiceMock.loginUser.and.returnValue(
      of({ success: true, user: { id: 1, user: 'testuser' } })
    );

    component.onSubmit();

    expect(loginServiceMock.loginUser).toHaveBeenCalledWith(
      'testuser',
      'password'
    );
    expect(component.loginError).toBeFalse();
  });

  it('debería manejar un error de autenticación', () => {
    component.loginForm.setValue({
      username: 'testuser',
      password: 'wrongpassword',
    });
    loginServiceMock.loginUser.and.returnValue(of({ success: false }));

    component.onSubmit();

    expect(loginServiceMock.loginUser).toHaveBeenCalledWith(
      'testuser',
      'wrongpassword'
    );
    expect(component.loginError).toBeTrue();
  });

  it('debería manejar un error en la llamada al servicio', () => {
    component.loginForm.setValue({
      username: 'testuser',
      password: 'password',
    });
    loginServiceMock.loginUser.and.returnValue(
      throwError(() => new Error('Server Error'))
    );

    component.onSubmit();

    expect(loginServiceMock.loginUser).toHaveBeenCalledWith(
      'testuser',
      'password'
    );
    expect(component.loginError).toBeTrue();
  });

  it('debería verificar que se ejecuta en el navegador', () => {
    expect(component.isBrowser()).toBeTrue();
  });
});
