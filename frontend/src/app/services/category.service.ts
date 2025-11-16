import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Category {
  name: string;               
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:3000/categories/'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, category);
  }

  getCategoryById(id: number): Observable<Category>{
    return this.http.get<Category>(`${this.baseUrl}${id}`);
  }

  updateCategory(id:number,category: Category): Observable<Category> {
    return this.http.patch<Category>(`${this.baseUrl}${id}`, category);
  }
}
