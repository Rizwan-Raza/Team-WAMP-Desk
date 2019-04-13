import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { CalendarComponent } from './components/calendar/calendar.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuardService],
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        canActivate: [AuthGuardService],
        component: HomeComponent
    },
    {
        path: 'calendar',
        canActivate: [AuthGuardService],
        component: CalendarComponent
    },
    {
        path: 'login',
        component: LoginComponent
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
