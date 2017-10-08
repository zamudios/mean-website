import { Injectable }       from '@angular/core';
import {
  CanActivate, Router
}                           from '@angular/router';
import { AuthService }      from '../services/auth.service';

@Injectable()
export class UnAuthGuard implements CanActivate {

    constructor ( 
        private authService : AuthService,
        private router : Router
    ) { }

    // Determine if user can activate (access) a section of the site.
    canActivate() {
        if (this.authService.loggedIn()) {
            this.router.navigate(['/']);
            return false;
        } else {
            return true;
        }
    }
}