import { Injectable } from '@angular/core';


import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    user,
    User,
} from '@angular/fire/auth';

import { BehaviorSubject, from, map, Observable, pipe, tap } from 'rxjs';
import { MochucoUser } from './mochuco-user.model';
import { Router } from '@angular/router';
import { UserRoles } from 'src/app/shared/models';

const AUTH_DATA = 'auth_data'
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    fireAuthUser;
    $roles: Observable<UserRoles>;

    private mochucoUserSubject = new BehaviorSubject<MochucoUser>(null);
    mochucoUser$: Observable<MochucoUser> = this.mochucoUserSubject.asObservable();

    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    // public isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private isAdminSubject = new BehaviorSubject<boolean>(false);
    public isAdmin$ = this.isAdminSubject.asObservable();

    constructor(
        private afAuth: Auth,
        private router: Router) {


        const mochucoUserString = localStorage.getItem(AUTH_DATA);
        if (mochucoUserString) {
            const mochucoUser: MochucoUser = JSON.parse(mochucoUserString);
            this.mochucoUserSubject.next(mochucoUser)
            if (mochucoUser.email === 'jackoboes@gmail.com') {
                this.isAdminSubject.next(true);
            }


        }
        // this.$roles =
        // this.afAuth.currentUser.getIdTokenResult()
        //     .then(data => console.log(data))
        //     .catch(err => console.log(err));
    }

    signUp(user: MochucoUser) {
        console.log(user)
        createUserWithEmailAndPassword(this.afAuth, user.email, user.password)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    logIn(mochucoUser: MochucoUser) {

        return from(signInWithEmailAndPassword(this.afAuth, mochucoUser.email, mochucoUser.password))
            .pipe(
                tap((fireAuthUser: any) => {
                    this.fireAuthUser = fireAuthUser
                    console.log(fireAuthUser.user);
                    console.log(fireAuthUser.user.stsTokenManager);
                    console.log(fireAuthUser.user.stsTokenManager.accessToken);
                    const mochucoUser: MochucoUser = {
                        email: fireAuthUser.user.email
                    }
                    this.mochucoUserSubject.next(mochucoUser);
                    this.isLoggedInSubject.next(true);
                    if (fireAuthUser.user.email === 'jackoboes@gmail.com') {
                        console.log('admin!')
                        this.isAdminSubject.next(true);
                    } else {
                        console.log('not admin')
                    }
                    localStorage.setItem(AUTH_DATA, JSON.stringify(mochucoUser));
                })
            )

    }
    logout() {
        console.log(this.fireAuthUser);
        this.afAuth.signOut()
            .then((res) => {
                console.log('logged out')
                this.mochucoUserSubject.next(null);
                localStorage.removeItem(AUTH_DATA);
                this.router.navigateByUrl('mochuco');
            })
            .catch(err => console.log(err));

    }
}
