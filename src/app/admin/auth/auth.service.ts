import { Injectable } from '@angular/core';


import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    User,
} from '@angular/fire/auth';
import { jsonEval } from '@firebase/util';
import { BehaviorSubject, from, map, Observable, pipe, tap } from 'rxjs';
import { MochucoUser } from './mochuco-user.model';
import { Router } from '@angular/router';

const AUTH_DATA = 'auth_data'
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private mochucoUserSubject = new BehaviorSubject<MochucoUser>(null);
    mochucoUser$: Observable<MochucoUser> = this.mochucoUserSubject.asObservable();

    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    public isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private isAdminSubject = new BehaviorSubject<boolean>(false);
    public isAdmin$ = this.isAdminSubject.asObservable();

    constructor(
        private auth: Auth,
        private router: Router) {
        const mochucoUserString = localStorage.getItem(AUTH_DATA);
        if (mochucoUserString) {
            const mochucoUser: MochucoUser = JSON.parse(mochucoUserString);
            this.mochucoUserSubject.next(mochucoUser)
            if (mochucoUser.email === 'jackoboes@gmail.com') {
                this.isAdminSubject.next(true);
            }

        }
    }

    signUp(user: MochucoUser) {
        console.log(user)
        createUserWithEmailAndPassword(this.auth, user.email, user.password)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    logIn(mochucoUser: MochucoUser) {

        return from(signInWithEmailAndPassword(this.auth, mochucoUser.email, mochucoUser.password))
            .pipe(
                tap((fireAuthUser: any) => {

                    console.log(fireAuthUser.user);
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
    logOut() {
        this.mochucoUserSubject.next(null);
        localStorage.removeItem(AUTH_DATA)
        this.router.navigateByUrl('mochuco')
    }
}
