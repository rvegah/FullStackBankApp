import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportGeneratorComponent } from './components/report-generator/report-generator.component';
import { ReportViewerComponent } from './components/report-viewer/report-viewer.component';

@NgModule({
  declarations: [
    ReportGeneratorComponent,
    ReportViewerComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ReportsModule { }