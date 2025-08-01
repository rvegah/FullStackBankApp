import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovementListComponent } from './components/movement-list/movement-list.component';
import { MovementFormComponent } from './components/movement-form/movement-form.component';
import { MovementDetailComponent } from './components/movement-detail/movement-detail.component';

const routes: Routes = [
  { path: '', component: MovementListComponent },
  { path: 'new', component: MovementFormComponent },
  { path: 'edit/:id', component: MovementFormComponent },
  { path: 'detail/:id', component: MovementDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovementsRoutingModule { }