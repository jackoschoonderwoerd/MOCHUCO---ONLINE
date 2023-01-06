import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, map } from "rxjs";
import { Injectable } from '@angular/core';
import { AuthService } from './admin/auth/auth.service';
import { Auth } from '@angular/fire/auth';

@Injectable()

export class AppAuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router,
        private afAuth: Auth) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

        const user = this.afAuth.currentUser
        if (user) {
            console.log('logged in')
            return true
        } else {
            console.log('not logged in');
            this.router.navigateByUrl('/admin/login')
        }
    }
}
