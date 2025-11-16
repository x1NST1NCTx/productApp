import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, CategoryService } from '../services/category.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-category',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.scss',
})
export class AddCategory {
  
  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  constructor(private http: HttpClient, private categoryService: CategoryService, private snackBar: MatSnackBar) {}

  onSubmit(){
    
    if (this.categoryForm.valid) {
      
      const category = this.categoryForm.value;
      const categoryPayload: Category = {
        name: category.name!
      }

      this.categoryService.addCategory(categoryPayload).subscribe({
        next: (response) => {
          this.snackBar.open('Category added successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
          });
          this.categoryForm.reset();
        },
        error: (error) => {
          this.snackBar.open('Failed to add category. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        },
        
      })
    }
  }
}
