import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Usuario {
  id?: string;
  usuario: string;
  telefono: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  correo: string;
  direccion: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private baseUrl =
    'https://mitienda07-07-default-rtdb.firebaseio.com/usuarios';

  constructor(private http: HttpClient) {}

  addUser(user: Usuario): Observable<any> {
    return this.http.post(`${this.baseUrl}.json`, user);
  }

  getUsers(): Observable<Usuario[]> {
    return this.http
      .get<{ [key: string]: Usuario }>(`${this.baseUrl}.json`)
      .pipe(
        map((response) => {
          if (response) {
            return Object.keys(response).map((key) => ({
              id: key,
              ...response[key],
            }));
          } else {
            return [];
          }
        })
      );
  }

  userExists(email: string, username: string): Observable<boolean> {
    return this.getUsers().pipe(
      map((users) => {
        return users.some(
          (user) => user.correo === email || user.usuario === username
        );
      })
    );
  }

  updateUser(userId: string, user: Usuario): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}.json`, user);
  }
}
