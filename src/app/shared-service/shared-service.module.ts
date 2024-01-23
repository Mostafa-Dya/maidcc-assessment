import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from '../loader/loader.component';
import { NumericInputDirective } from '../directives/numeric-input.directive';



@NgModule({
  declarations: [NumericInputDirective],
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    HttpClientModule,
    LoaderComponent
  ],
  exports:[
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    RouterLink,
    RouterOutlet,
    CommonModule,
    LoaderComponent,
    NumericInputDirective
  ]
})
export class SharedServiceModule { }
