import { Injectable } from '@angular/core';


import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setPersistence,
    browserSessionPersistence,
    user,
    User,
    getAuth,
    onAuthStateChanged
} from '@angular/fire/auth';

import { BehaviorSubject, from, map, Observable, pipe, tap } from 'rxjs';
import { MochucoUser } from './mochuco-user.model';
import { Router } from '@angular/router';
import { UserRoles } from 'src/app/shared/models';
import { GeneralStoreService } from '../../shared/general-store.service';

const AUTH_DATA = 'auth_data'
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    fireAuthUser;
    $roles: Observable<UserRoles>;

    private mochucoUserSubject = new BehaviorSubject<MochucoUser>(null);
    public mochucoUser$: Observable<MochucoUser> = this.mochucoUserSubject.asObservable();

    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    public isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private isAdminSubject = new BehaviorSubject<boolean>(false);
    public isAdmin$ = this.isAdminSubject.asObservable();

    constructor(
        private afAuth: Auth,
        private router: Router,
        private generalStore: GeneralStoreService

    ) {


        // const mochucoUserString = localStorage.getItem(AUTH_DATA);
        // if (mochucoUserString) {

        //     console.log(mochucoUserString);
        //     const mochucoUser: MochucoUser = JSON.parse(mochucoUserString);
        //     this.mochucoUserSubject.next(mochucoUser)
        //     if (mochucoUser.email === 'jackoboes@gmail.com') {
        //         this.isAdminSubject.next(true);
        //     } else {
        //         this.isAdminSubject.next(false)
        //     }
        // }
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
        console.log(mochucoUser);
        // console.log(mochucoUser.email);
        // console.log(mochucoUser.password);
        return from(signInWithEmailAndPassword(this.afAuth, mochucoUser.email, mochucoUser.password))
            .pipe(
                tap((fireAuthUser: any) => {
                    this.fireAuthUser = fireAuthUser
                    console.log(fireAuthUser.user);
                    // console.log(fireAuthUser.user.stsTokenManager);
                    // console.log(fireAuthUser.user.stsTokenManager.accessToken);
                    const mochucoUser: MochucoUser = {
                        email: fireAuthUser.user.email
                    }
                    this.mochucoUserSubject.next(mochucoUser);
                    this.checkTimeOut()
                    this.isLoggedInSubject.next(true);
                    if (fireAuthUser.user.email === 'jackoboes@gmail.com') {
                        // console.log('admin!')
                        this.isAdminSubject.next(true);
                    } else {
                        this.isAdminSubject.next(false);
                        console.log('not admin')
                    }
                })
            )
    }

    setIsLoggedIn(status: boolean) {
        this.isLoggedInSubject.next(status)
    }

    // setUserToNull() {
    //     this.mochucoUserSubject.next(null);
    // }

    logout() {
        // console.log(this.fireAuthUser);
        this.afAuth.signOut()
            .then((res) => {
                // console.log('logged out')
                this.mochucoUserSubject.next(null);
                localStorage.removeItem('mochucoUser');
                // this.generalStore.setAllToNull();
                this.router.navigateByUrl('/admin/login');
                this.isLoggedInSubject.next(false);
            })
            .catch(err => console.log(err));

    }
    checkTimeOut() {
        console.log('checkTimeOut')
        setTimeout(
            () => {
                // this.userInactive.next("You are logged out due to inactivity of 15 minutes. Please log in again"), 1000 * 60 * 10;
                // this.generalStore.setAllToNull();
                alert("You are logged out due to inactivity of 15 minutes. Please log in again");
                this.logout();
            }, 1000 * 60 * 15
        );
    }
}
