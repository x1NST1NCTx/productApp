import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Product, ProductService } from '../services/product.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatCardModule],
  templateUrl: './search-product.html',
  styleUrls: ['./search-product.scss']
})
export class SearchProduct implements OnChanges {
  @Input() searchKeyword: string = '';
  products: Product[] = [];
  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 10;

  constructor(private productService: ProductService, private snackBar: MatSnackBar) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('searchKeyword' in changes && this.searchKeyword.trim()) {
      const totalPages = this.totalPages();
      let clampedPage = this.page;

      if (clampedPage < 1) clampedPage = 1;
      if (totalPages > 0 && clampedPage > totalPages) clampedPage = totalPages;

      this.fetchProducts(clampedPage);
    } else {
      this.products = [];
      this.totalCount = 0;
    }
  }

  fetchProducts(page: number): void {
    const totalPages = this.totalPages();

    if (page < 1 || (totalPages > 0 && page > totalPages)) {
      return;
    }

    this.page = page;

    this.productService.searchProducts(this.searchKeyword.trim(), page, this.pageSize).subscribe({
      next: res => {
        this.products = res.items;
        this.totalCount = res.totalCount;
      },
      error: () => {
        this.products = [];
        this.totalCount = 0;
      }
    });
  }

  onPageChange(newPage: number) {
    const totalPages = this.totalPages();
    let page = newPage;

    if (page < 1) {
      page = 1;
    }
    if (totalPages > 0 && page > totalPages) {
      page = totalPages;
    }

    if (page !== this.page) {
      this.fetchProducts(page);
    }
  }

  totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
