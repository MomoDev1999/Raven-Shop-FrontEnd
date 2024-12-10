import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  const mockApiUrl = 'http://localhost:8080/personas';
  const mockApiKey =
    '59a28b54f7abae1f8e110314fd182d7f2ca1a2988a1f02f6de8de15c5d942e13';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService],
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener usuarios', () => {
    const mockResponse = { data: [{ id: 1, name: 'Usuario 1' }] };
    service.getUsers(1, 5).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockApiUrl}?page=1&size=5`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('x-api-key')).toBe(mockApiKey);
    req.flush(mockResponse);
  });

  it('debería agregar un usuario', () => {
    const mockUser = { name: 'Nuevo Usuario' };
    const mockResponse = { success: true };

    service.addUser(mockUser).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(mockApiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockResponse);
  });

  it('debería actualizar un usuario', () => {
    const mockUser = { name: 'Usuario Actualizado' };
    const mockResponse = { success: true };

    service.updateUser(1, mockUser).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockResponse);
  });

  it('debería eliminar un usuario', () => {
    const mockResponse = { success: true };

    service.deleteUser(1).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('debería obtener un usuario por ID', () => {
    const mockResponse = { id: 1, name: 'Usuario 1' };

    service.getUserById(1).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería realizar login de un usuario', () => {
    const mockLogin = { email: 'test@example.com', password: '123456' };
    const mockResponse = { token: 'mock-token' };

    service
      .loginUser(mockLogin.email, mockLogin.password)
      .subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(`${mockApiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLogin);
    req.flush(mockResponse);
  });

  it('debería verificar si un usuario existe', () => {
    const mockRequest = { email: 'test@example.com', user: 'username' };
    const mockResponse = { exists: true };

    service
      .userExists(mockRequest.email, mockRequest.user)
      .subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(`${mockApiUrl}/usuarios/existe`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });
});
