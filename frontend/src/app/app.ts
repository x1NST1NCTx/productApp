import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header'; 
import { AddProduct } from './add-product/add-product';
import { AddCategory } from './add-category/add-category';
import { BulkUpload } from './bulk-upload/bulk-upload';
import { CommonModule } from '@angular/common';
import { UpdateProduct } from './update-product/update-product';
import { UpdateCategory } from './update-category/update-category';
import { SearchProduct } from './search-product/search-product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Header, RouterOutlet, AddProduct, AddCategory, BulkUpload, UpdateProduct, UpdateCategory, SearchProduct],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']  
})
export class App {
  protected readonly title = signal('frontend');
  drawerOpen = signal<'add-product' | 'update-product' | 'add-category' | 'update-category' |'bulk-upload' | 'report-generation' | null>(null);

  searchKeyword = signal('');
  priceOrder = signal<'asc' | 'desc' | ''>('');
  filterByCategory = signal(false);

openDrawer(panel: 'add-product' | 'update-product' | 'add-category' | 'update-category' | 'bulk-upload' | 'report-generation') {
  this.drawerOpen.set(panel);
}

closeDrawer() {
  this.drawerOpen.set(null);
}
handleSearch(term: string) {
    this.searchKeyword.set(term);
}

onPriceOrderChange(order: 'asc' | 'desc' | '') {
  this.priceOrder.set(order);
}

onFilterByCategoryChange(filter: boolean) {
    this.filterByCategory.set(filter);
  }

}
