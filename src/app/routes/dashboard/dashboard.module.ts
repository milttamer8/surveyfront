import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToasterService } from 'angular2-toaster/angular2-toaster';



const routes: Routes = [
  { path: ':id', component: DashboardComponent },
];
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),

  ],
  providers: [
    ToasterService
  ],
})
export class DashboardModule { }
