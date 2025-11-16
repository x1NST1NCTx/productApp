import { Component, EventEmitter, Output, NgZone, ChangeDetectorRef } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { BulkUploadService } from '../services/bulk-upload.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bulk-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './bulk-upload.html',
  styleUrls: ['./bulk-upload.scss']
})
export class BulkUpload {
  @Output() fileSelected = new EventEmitter<File>();

  errorMessage = '';
  fileSelectedFile: File | null = null;
  isLoading = false;

  constructor(private ngZone: NgZone, private bulkUploadService: BulkUploadService, private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) {
    this.ngZone.run(() => this.fileSelectedFile = null);
    return;
  }
  const file = input.files[0];
  this.ngZone.run(() => {
    this.fileSelectedFile = file;
    this.errorMessage = '';
  });
  console.log('Selected File:', this.fileSelectedFile);

}


  submit() {
    if (!this.fileSelectedFile) return;

  this.isLoading = true;
  this.bulkUploadService.uploadFile(this.fileSelectedFile).subscribe({
    next: (response) => {
      this.isLoading = false;

      this.snackBar.open('Upload successful!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });

      this.ngZone.run(() => {
        this.fileSelectedFile = null;
        this.errorMessage = '';

        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }

        this.cdr.detectChanges(); // Manually trigger change detection
      });
    },
    error: (error) => {
      this.isLoading = false;
      this.snackBar.open('Upload failed. Please try again.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      this.errorMessage = 'Upload failed. Please try again.';
    }
  });
  }

  resetForm() {
  this.ngZone.run(() => {
    this.fileSelectedFile = null;
    this.errorMessage = '';
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.cdr.detectChanges();  // Trigger change detection after reset
  });
  
}

}
