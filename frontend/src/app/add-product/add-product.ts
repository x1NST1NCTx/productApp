import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { Product, ProductService } from '../services/product.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add-product',
  standalone: true,  // Add this if standalone component
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.scss'],  // corrected property name
})
export class AddProduct implements OnInit {
  categories: Category[] = [];

  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    imageUrl: new FormControl('', [Validators.pattern('https?://.+')]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    category: new FormControl<number | null>(null, [Validators.required]),
  });

  constructor(private http: HttpClient, private productService: ProductService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.http.get<Category[]>('http://localhost:3000/categories/').subscribe({
      next: (data) => (this.categories = data),
      error: (error) => {
        console.error('Failed to load categories', error);
        this.categories = [];
      }
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      
      const productPayload: Product = {
        name: product.name!,
        image_url: product.imageUrl ?? '',
        price: Number(product.price!),
        category_id: product.category!,
      };
      
      this.productService.addProduct(productPayload).subscribe({
        next: (response) => {
          this.snackBar.open('Product added successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
          });
          this.productForm.reset();
        },
        error: (error) => {
          this.snackBar.open('Failed to add product. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        },
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}
