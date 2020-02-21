import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

const routes: Routes = [
    { path: ':id', component: HomeComponent },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        Ng2TableModule,

    ],
    declarations: [HomeComponent],
    providers: [
        ToasterService
      ],
    exports: [
        RouterModule
    ]
})
export class HomeModule { }