import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Category, CategoryService } from '../services/category.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-update-category',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule],
  templateUrl: './update-category.html',
  styleUrl: './update-category.scss',
})
export class UpdateCategory {

  categoryForm = new FormGroup({
    id: new FormControl<number | null>(null, [Validators.required]),
    name: new FormControl('', [Validators.required]),
  });
  
  constructor(private http: HttpClient, private categoryService: CategoryService, private snackBar: MatSnackBar) {}

  searchCategory() {
    const categoryId = this.categoryForm.get('id')?.value;
    if (!categoryId) {
      return;  
    }

    this.categoryService.getCategoryById(categoryId).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name:category.name
        })
      },
      error: (err) => {
      // Handle not found or error
      console.error('Category not found or error', err);
    }
    })
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const category = this.categoryForm.value;

      const categoryPayload: Category = {
        name: category.name!
      };

      this.categoryService.updateCategory(Number(category.id),categoryPayload).subscribe({
        next: (response) => {
          this.snackBar.open('Category updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
          });
          this.categoryForm.reset();
        },
        error: (error) => {
          this.snackBar.open('Failed to update category. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        },
      });
    } else {
      this.categoryForm.markAllAsTouched();
    }
  
  }

}
