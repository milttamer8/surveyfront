import { NgModule } from '@angular/core';
import { ReportpollComponent } from './reportpoll/reportpoll.component';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: ':id', component: ReportpollComponent },
];
@NgModule({
  declarations: [ReportpollComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    NgxDatatableModule

  ],
  exports: [
    RouterModule
  ]  
})
export class ReportpollModule { }
