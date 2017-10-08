import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';
import { AuthService }      from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    redirectedUrl;

    constructor ( 
        private authService : AuthService,
        private router : Router
    ) { }

    // Determine if user can activate (access) a section of the site.
    canActivate(
        router : ActivatedRouteSnapshot,
        state : RouterStateSnapshot
    ) {
        if (this.authService.loggedIn()) {
            return true;
        } else {
            this.redirectedUrl = state.url;
            this.router.navigate(['/login']);
            return false;
        }
    }
}