import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/personas';
  private apiKey =
    '59a28b54f7abae1f8e110314fd182d7f2ca1a2988a1f02f6de8de15c5d942e13';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
    });
  }

  getUsers(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}`, {
      headers: this.getHeaders(),
    });
  }

  addUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, user, {
      headers: this.getHeaders(),
    });
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user, {
      headers: this.getHeaders(),
    });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      { email, password },
      { headers: this.getHeaders() }
    );
  }

  userExists(email: string, user: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/usuarios/existe`,
      { email, user },
      { headers: this.getHeaders() }
    );
  }
}
