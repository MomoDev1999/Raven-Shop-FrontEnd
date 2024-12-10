import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarComponent } from './registrar.component';
import { LoginService } from '../../services/login.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

describe('RegistrarComponent', () => {
  let component: RegistrarComponent;
  let fixture: ComponentFixture<RegistrarComponent>;
  let loginServiceMock: any;
  let router: Router;
  let ngZone: NgZone;

  beforeEach(async () => {
    loginServiceMock = {
      userExists: jasmine.createSpy('userExists'),
      addUser: jasmine.createSpy('addUser'),
    };

    await TestBed.configureTestingModule({
      imports: [
        RegistrarComponent,
        FormsModule,
        RouterTestingModule.withRoutes([{ path: 'index', redirectTo: '' }]),
        CommonModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: LoginService, useValue: loginServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);

    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería validar si el formulario es válido', () => {
    component.username = 'testuser';
    component.phone = '12345678';
    component.firstname = 'John';
    component.lastname = 'Doe';
    component.birthdate = '1990-01-01';
    component.email = 'test@example.com';
    component.address = '123 Main St';
    component.password = 'Password1!';
    component.confirmPassword = 'Password1!';

    expect(component.isFormValid()).toBeTrue();
  });

  it('debería registrar un usuario si el formulario es válido y el usuario no existe', () => {
    component.username = 'testuser';
    component.phone = '12345678';
    component.firstname = 'John';
    component.lastname = 'Doe';
    component.birthdate = '1990-01-01';
    component.email = 'test@example.com';
    component.address = '123 Main St';
    component.password = 'Password1!';
    component.confirmPassword = 'Password1!';

    loginServiceMock.userExists.and.returnValue(of({ exists: false }));
    loginServiceMock.addUser.and.returnValue(of({ success: true }));

    ngZone.run(() => {
      component.onSubmit();
    });

    expect(loginServiceMock.userExists).toHaveBeenCalledWith(
      'test@example.com',
      'testuser'
    );
    expect(loginServiceMock.addUser).toHaveBeenCalled();
  });

  it('debería manejar errores al registrar un usuario', () => {
    component.username = 'testuser';
    component.phone = '12345678';
    component.firstname = 'John';
    component.lastname = 'Doe';
    component.birthdate = '1990-01-01';
    component.email = 'test@example.com';
    component.address = '123 Main St';
    component.password = 'Password1!';
    component.confirmPassword = 'Password1!';

    loginServiceMock.userExists.and.returnValue(of({ exists: false }));
    loginServiceMock.addUser.and.returnValue(
      throwError(() => new Error('Error de servidor'))
    );

    component.onSubmit();

    expect(loginServiceMock.addUser).toHaveBeenCalled();
  });
});
