import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
// Importing components for the routes created.
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { BlogComponent } from './components/blog/blog.component';
import { EditComponent } from './components/blog/edit/edit.component';
import { DeleteComponent } from './components/blog/delete/delete.component';
import { AuthGuard } from './guards/auth.guard';
import { UnAuthGuard } from './guards/unauth.guard'

// Array of Angular Routes
const appRoutes: Routes = [
    {   path: '', 
        component: HomeComponent        // Default route.
    },
    {
        path:'dashboard',
        component: DashboardComponent,  // Dashboard route.
        canActivate: [AuthGuard]        // If user is logged in they can activate this page.   
    },
    {
        path:'register',                // Registration route.
        component: RegisterComponent,
        canActivate: [UnAuthGuard]
    },
    {
        path:'login',                   // Log in route.
        component: LoginComponent,
        canActivate: [UnAuthGuard]  
    },
    {
        path:'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'user/:username',
        component: PublicProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'blog',
        component: BlogComponent,
        canActivate: [AuthGuard]
    },{
        path:'edit/:id',
        component: EditComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'delete/:id',
        component: DeleteComponent,
        canActivate: [AuthGuard]
    },
    {    
        path: '**',                     // Everything else that is not specified.
        component: HomeComponent}
];

@NgModule({
  declarations: [],
  imports: [
      RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [],
  exports: [ RouterModule ] 
})

export class AppRoutingModule { }
