import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Product, ProductService } from '../services/product.service';
import { MatIconModule } from '@angular/material/icon';

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-update-product',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule],
  templateUrl: './update-product.html',
  styleUrl: './update-product.scss',
})
export class UpdateProduct {
  categories: Category[] = [];

  productForm = new FormGroup({
    id: new FormControl<number | null>(null, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    imageUrl: new FormControl('', [Validators.pattern('https?://.+')]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
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
      
      this.productService.updateProduct(Number(product.id),productPayload).subscribe({
        next: (response) => {
          this.snackBar.open('Product updated successfully!', 'Close', {
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

  searchProduct() {
  const productId = this.productForm.get('id')?.value;
  if (!productId) {
    return;  
  }

  this.productService.getProductById(productId).subscribe({
    next: (product) => {
      // Populate form controls with received data
      this.productForm.patchValue({
        name: product.name,
        imageUrl: product.image_url,
        price: Number(product.price),
        category: product.category_id  
      });
    },
    error: (err) => {
      // Handle not found or error
      console.error('Product not found or error', err);
    }
  });
}
}
