import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../services/product.service';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { error } from 'console';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  searchQuery = '';
  isMenuOpen = false;
  isOptionsOpen = false;

  @Output() addProduct = new EventEmitter<void>();
  @Output() updateProduct = new EventEmitter<void>();
  @Output() addCategory = new EventEmitter<void>();
  @Output() updateCategory = new EventEmitter<void>();
  @Output() bulkUpload = new EventEmitter<void>();
  @Output() usersClicked = new EventEmitter<void>();
  @Output() searchTerm = new EventEmitter<string>();

  private searchSubject = new Subject<string>();
  private subscription: Subscription;
  
  constructor(private router: Router, private http: HttpClient) {
    this.subscription = this.searchSubject.pipe(
      debounceTime(700)  // Wait 700ms after last event before emitting
    ).subscribe(term => {
      const trimmed = term.trim();
      if (trimmed) {
        this.searchTerm.emit(trimmed);
      }
    });
  }

  searchResults: Product[] = [];

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.closeMenus();
  }

  onSearch(query: string) {
    this.searchSubject.next(query);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) this.isOptionsOpen = false;
  }

  toggleOptions() {
    this.isOptionsOpen = !this.isOptionsOpen;
    if (this.isOptionsOpen) this.isMenuOpen = false;
  }

  closeMenus() {
    this.isMenuOpen = false;
    this.isOptionsOpen = false;
  }

  // Call this from the menu list item in your template
  triggerAddProduct() {
    this.addProduct.emit();
    this.closeMenus();
  } 

  triggerUpdateProduct(){
    this.updateProduct.emit();
    this.closeMenus();
  }

  triggerAddCategory() {
    this.addCategory.emit();
    this.closeMenus();
  }

  triggerUpdateCategory(){
    this.updateCategory.emit();
    this.closeMenus();
  }

  triggerBulkUpload() {
    this.bulkUpload.emit();
    this.closeMenus();
  }

  triggerReportGeneration() {
  const reportGenUrl = 'http://localhost:3000/products/report/csv';

  this.http.get(reportGenUrl, { responseType: 'blob' }).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'product-report.csv';  // Set the desired download file name here
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (error) => {
      console.error('Report generation error:', error);
    }
  });
}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

