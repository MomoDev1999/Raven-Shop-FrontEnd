import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/api'; // Reemplaza con la URL real de tu API
  private apiKey =
    '59a28b54f7abae1f8e110314fd182d7f2ca1a2988a1f02f6de8de15c5d942e13'; // Reemplaza con tu clave API real

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'x-api-key': this.apiKey, // Cambia el encabezado a 'x-api-key'
      'Content-Type': 'application/json', // Asegúrate de que el tipo de contenido es JSON
    });
  }

  // Obtener todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios`, {
      headers: this.getHeaders(),
    });
  }

  // Crear un nuevo usuario
  addUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, user, {
      headers: this.getHeaders(),
    });
  }

  // Actualizar un usuario existente
  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, user, {
      headers: this.getHeaders(),
    });
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Obtener un usuario específico por ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Login de usuario
  loginUser(userOrEmail: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/usuarios/login`,
      {
        userOrEmail,
        password,
      },
      { headers: this.getHeaders() }
    );
  }

  // Verificar si el usuario o correo ya existe
  userExists(email: string, user: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/usuarios/existe`,
      { email, user },
      { headers: this.getHeaders() }
    );
  }
}
