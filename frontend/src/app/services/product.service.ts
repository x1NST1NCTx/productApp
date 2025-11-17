import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  name: string;             
  image_url?: string;       
  price: number;            
  category_id: number;      
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private baseUrl = 'http://localhost:3000/products/';
  constructor(private http: HttpClient) {}

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  updateProduct(id:number,product: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}${id}`, product);
  }

  getProductById(id: number): Observable<Product>{
    return this.http.get<Product>(`${this.baseUrl}${id}`);
  }

  searchProducts(
  keyword: string,
  page: number,
  pageSize: number,
  priceOrder: 'asc' | 'desc' | '' = '',
  filterByCategory = false
): Observable<PagedResult<Product>> {
  let params = new HttpParams()
    .set('q', keyword)
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

  if (priceOrder) {
    params = params.set('priceOrder', priceOrder);
  }

  if (filterByCategory) {
    params = params.set('filterByCategory', 'true'); 
  }

  return this.http.get<PagedResult<Product>>(`${this.baseUrl}search`, { params });
  }
}
