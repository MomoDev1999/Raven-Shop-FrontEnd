import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Compra {
  id: number;
  producto: {
    id: number;
    title: string;
    price: number;
    image: string;
  };
  cantidad: number;
  fecha: string;
  estado: string; // Estado del pedido (puede ser opcional)
}

@Injectable({
  providedIn: 'root',
})
export class MisComprasService {
  private apiUrl = 'http://localhost:8080/compras/persona'; // URL del backend

  constructor(private http: HttpClient) {}

  getMisCompras(personaId: number): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/${personaId}`);
  }
}
