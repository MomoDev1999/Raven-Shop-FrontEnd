import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';
  private productosSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  public productos$: Observable<any[]> = this.productosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.http
      .get<any[]>(this.apiUrl)
      .pipe(tap((productos) => this.productosSubject.next(productos)))
      .subscribe();
  }

  getProductos(): Observable<any[]> {
    return this.productos$;
  }

  getProductoPorId(id: number): Observable<any> {
    const productos = this.productosSubject.getValue();
    const producto = productos.find((producto) => producto.id === id);
    return of(producto);
  }

  buscarPorCategoria(categoria: string): Observable<any[]> {
    return this.productos$.pipe(
      map((productos) =>
        productos.filter((producto) => producto.category === categoria)
      )
    );
  }

  buscarProductos(termino: string): Observable<any[]> {
    return this.productos$.pipe(
      map((productos) =>
        productos.filter((producto) =>
          producto.title.toLowerCase().includes(termino.toLowerCase())
        )
      )
    );
  }
}
