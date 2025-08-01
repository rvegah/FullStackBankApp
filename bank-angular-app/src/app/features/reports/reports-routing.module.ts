import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportGeneratorComponent } from './components/report-generator/report-generator.component';
import { ReportViewerComponent } from './components/report-viewer/report-viewer.component';

const routes: Routes = [
  { path: '', component: ReportGeneratorComponent },
  { path: 'viewer', component: ReportViewerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }