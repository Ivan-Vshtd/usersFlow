import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatInputModule,
  MatPaginatorModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule, MatDialogModule, MatTableModule, MatPaginatorModule],
  exports: [CommonModule, MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule, MatDialogModule, MatTableModule, MatPaginatorModule],
})
export class CustomMaterialModule {
}
