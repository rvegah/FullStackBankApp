import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MovementsRoutingModule } from './movements-routing.module';
import { MovementListComponent } from './components/movement-list/movement-list.component';
import { MovementFormComponent } from './components/movement-form/movement-form.component';
import { MovementDetailComponent } from './components/movement-detail/movement-detail.component';

@NgModule({
  declarations: [
    MovementListComponent,
    MovementFormComponent,
    MovementDetailComponent
  ],
  imports: [
    CommonModule,
    MovementsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MovementsModule { }