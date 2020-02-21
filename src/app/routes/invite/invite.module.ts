import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { InviteComponent } from './invite/invite.component';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: ':id', component: InviteComponent },
];
@NgModule({
  declarations: [InviteComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
  ],
  providers: [
    ToasterService
  ],
})
export class InviteModule { }
