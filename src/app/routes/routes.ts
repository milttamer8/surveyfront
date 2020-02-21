import { LayoutComponent } from '../layout/layout.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RecoverComponent } from './pages/recover/recover.component';
import { LockComponent } from './pages/lock/lock.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { Error404Component } from './pages/error404/error404.component';
import { Error500Component } from './pages/error500/error500.component';
import { ActivateGuard } from '../activate.guard';


export const routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    // Not lazy-loaded routes
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'recover', component: RecoverComponent },
    { path: 'lock', component: LockComponent },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: '404', component: Error404Component },
    { path: '500', component: Error500Component },

    {
        path: '',
        component: LayoutComponent,
        canActivate: [ActivateGuard],
        children: [
            
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'createpoll', loadChildren: './createpoll/createpoll.module#CreatepollModule' },
            { path: 'reportpoll', loadChildren: './reportpoll/reportpoll.module#ReportpollModule' },
            { path: 'invite', loadChildren: './invite/invite.module#InviteModule' }
        ]
    },
    
    // Not found
    { path: '**', redirectTo: '404' }

];
