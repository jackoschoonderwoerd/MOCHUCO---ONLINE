import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, map } from "rxjs";
import { Injectable } from '@angular/core';
import { AuthService } from './admin/auth/auth.service';

@Injectable()

export class AppAuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        console.log('Authguard called')
        return this.authService.isLoggedIn$.pipe(
            map((isLoggedIn: boolean) => {
                if (isLoggedIn) {
                    console.log('guard is logged in')
                    return true
                } else {
                    console.log('guard is NOT logged in')
                    this.router.navigate(['/admin/login'])
                }
            })

        )
    }
}
