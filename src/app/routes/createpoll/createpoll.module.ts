import { NgModule } from '@angular/core';
import { CreatepollComponent } from './createpoll/createpoll.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


const routes: Routes = [
  { path: ':id', component: CreatepollComponent },
];
@NgModule({
  declarations: [CreatepollComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    NgxDatatableModule

  ],
  providers: [
    ToasterService
  ],
})
export class CreatepollModule { }
