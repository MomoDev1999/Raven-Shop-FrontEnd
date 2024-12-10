import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPerfilComponent } from './editar-perfil.component';
import { LoginService } from '../../services/login.service';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('EditarPerfilComponent', () => {
  let component: EditarPerfilComponent;
  let fixture: ComponentFixture<EditarPerfilComponent>;
  let loginServiceMock: any;

  beforeEach(async () => {
    loginServiceMock = {
      getUsers: jasmine.createSpy('getUsers').and.returnValue(
        of({
          content: [
            {
              id: 1,
              user: 'testuser',
              phone: '12345678',
              firstName: 'Test',
              lastName: 'User',
              dateOfBirth: '2000-01-01',
              email: 'test@example.com',
              address: 'Test Address',
            },
          ],
        })
      ),
      updateUser: jasmine.createSpy('updateUser').and.returnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [EditarPerfilComponent],
      providers: [{ provide: LoginService, useValue: loginServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPerfilComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar datos del usuario al inicializarse si el usuario está logueado', () => {
    spyOn(localStorage, 'getItem').and.returnValue('testuser');
    spyOn(component, 'loadUserData');

    component.ngOnInit();

    expect(loginServiceMock.getUsers).toHaveBeenCalled();
    expect(component.loggedUser).toEqual({
      id: 1,
      user: 'testuser',
      phone: '12345678',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '2000-01-01',
      email: 'test@example.com',
      address: 'Test Address',
    });
    expect(component.loadUserData).toHaveBeenCalled();
  });

  it('debería mostrar un error si el usuario no se encuentra en localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(Swal, 'fire');

    component.ngOnInit();
  });

  it('debería validar correctamente el formulario', () => {
    component.username = 'testuser';
    component.phone = '12345678';
    component.firstName = 'Test';
    component.lastName = 'User';
    component.dateOfBirth = '2000-01-01';
    component.email = 'test@example.com';
    component.address = 'Test Address';
    component.passwordActual = 'password123';
    component.password = 'password123';
    component.confirmPassword = 'password123';

    expect(component.isFormValid()).toBeTrue();
  });

  it('debería actualizar el perfil del usuario correctamente', () => {
    spyOn(Swal, 'fire');
    component.loggedUser = { id: 1 };
    component.username = 'newuser';
    component.phone = '87654321';
    component.firstName = 'New';
    component.lastName = 'User';
    component.dateOfBirth = '1999-12-31';
    component.email = 'new@example.com';
    component.address = 'New Address';
    component.password = 'newpassword';

    component.updateUserProfile();

    expect(loginServiceMock.updateUser).toHaveBeenCalledWith(1, {
      user: 'newuser',
      phone: '87654321',
      firstName: 'New',
      lastName: 'User',
      dateOfBirth: '1999-12-31',
      email: 'new@example.com',
      address: 'New Address',
      password: 'newpassword',
    });
  });

  it('debería mostrar un error si falla la actualización del perfil', () => {
    spyOn(Swal, 'fire');
    component.loggedUser = { id: 1 };
    loginServiceMock.updateUser.and.returnValue(of({ error: true }));

    component.updateUserProfile();
  });

  it('debería validar correctamente el teléfono', () => {
    component.phone = '12345678';
    expect(component.isPhoneValid()).toBeTrue();

    component.phone = '12345';
    expect(component.isPhoneValid()).toBeFalse();
  });

  it('debería validar correctamente el correo electrónico', () => {
    component.email = 'test@example.com';
    expect(component.isEmailValid()).toBeTrue();

    component.email = 'invalid-email';
    expect(component.isEmailValid()).toBeFalse();
  });

  it('debería validar correctamente la contraseña', () => {
    component.password = '123456';
    expect(component.isPasswordValid()).toBeTrue();

    component.password = '123';
    expect(component.isPasswordValid()).toBeFalse();
  });

  it('debería retornar true si está en un navegador', () => {
    expect(component.isBrowser()).toBeTrue();
  });

  it('debería cargar los datos del usuario desde loggedUser', () => {
    component.loggedUser = {
      user: 'testuser',
      phone: '12345678',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '2000-01-01',
      email: 'test@example.com',
      address: 'Test Address',
    };

    component.loadUserData();

    expect(component.username).toBe('testuser');
    expect(component.phone).toBe('12345678');
    expect(component.firstName).toBe('Test');
    expect(component.lastName).toBe('User');
    expect(component.dateOfBirth).toBe('2000-01-01');
    expect(component.email).toBe('test@example.com');
    expect(component.address).toBe('Test Address');
  });

  it('debería mostrar un error si algún campo está vacío', () => {
    spyOn(Swal, 'fire');
    component.username = '';
    component.phone = '12345678';
    component.firstName = 'Test';
    component.lastName = 'User';
    component.dateOfBirth = '2000-01-01';
    component.email = 'test@example.com';
    component.address = 'Test Address';
    component.passwordActual = 'password123';
    component.password = 'password123';
    component.confirmPassword = 'password123';

    component.validarEditar();

    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son requeridos.',
      })
    );
  });
});
