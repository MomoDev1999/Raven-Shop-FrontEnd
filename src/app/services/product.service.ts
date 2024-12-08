import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/productos';
  private productosSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  public productos$: Observable<any[]> = this.productosSubject.asObservable();

  constructor(private http: HttpClient) {}

  cargarProductos(): Observable<any[]> {
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(tap((productos) => this.productosSubject.next(productos)));
  }

  getProductos(): Observable<any[]> {
    return this.productos$;
  }

  getProductoPorId(id: number): Observable<any | undefined> {
    const productos = this.productosSubject.getValue();
    const producto = productos.find((producto) => producto.id === id);
    return of(producto);
  }

  buscarPorCategoria(categoria: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`, {
      params: { keyword: categoria },
    });
  }

  buscarProductos(termino: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`, {
      params: { keyword: termino },
    });
  }
}
