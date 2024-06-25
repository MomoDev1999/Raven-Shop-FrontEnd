import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = 'https://fakestoreapi.com/products/categories';
  private categoriesSubject: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  public categories$: Observable<string[]> =
    this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.http
      .get<string[]>(this.apiUrl)
      .pipe(tap((categories) => this.categoriesSubject.next(categories)))
      .subscribe();
  }

  getCategories(): Observable<string[]> {
    return this.categories$;
  }
}
