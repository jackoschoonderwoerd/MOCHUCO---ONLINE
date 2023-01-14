import { Injectable, NgZone } from '@angular/core';


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
import { MatDialog } from '@angular/material/dialog';
import { WarningComponent } from '../../shared/warning/warning.component';

const AUTH_DATA = 'auth_data'
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // fireAuthUser;
    $roles: Observable<UserRoles>;
    timer;
    countDownPeriod: number = (60 * 1000) * 15; // seconds * minutes

    private mochucoUserSubject = new BehaviorSubject<MochucoUser | null>(null);
    public mochucoUser$: Observable<MochucoUser> = this.mochucoUserSubject.asObservable();

    // private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    // public isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private isAdminSubject = new BehaviorSubject<boolean>(false);
    public isAdmin$ = this.isAdminSubject.asObservable();

    constructor(
        private afAuth: Auth,
        private router: Router,
        private zone: NgZone) { }

    signUp(user: MochucoUser) {
        // console.log(user)
        createUserWithEmailAndPassword(this.afAuth, user.email, user.password)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    logIn(mochucoUser: MochucoUser) {
        this.startCountDown()
        // this.startCountDown(this.countDownPeriod)
        return from(signInWithEmailAndPassword(this.afAuth, mochucoUser.email, mochucoUser.password))
            .pipe(
                tap((fireAuthUser: any) => {
                    console.log(fireAuthUser)
                    this.router.navigateByUrl('/admin/venues');
                    if (fireAuthUser.user.email === 'jackoboes@gmail.com') {
                        this.isAdminSubject.next(true);
                    } else {
                        this.isAdminSubject.next(false);
                        console.log('not admin')
                    }
                })
            )
    }
    // How to stop a function during its execution - JavaScript
    // https://stackoverflow.com/questions/51793294/how-to-stop-a-function-during-its-execution-javascript

    startCountDown() {
        console.log('starting countdown', this.countDownPeriod)
        // this.timer = setTimeout(() => {
        //     this.router.navigate(['/admin/login', { action: 'logout' }])
        // }, this.countDownPeriod);
        this.timer = setTimeout(this.logOutAndNavigateToLogin.bind(this), this.countDownPeriod);
    }

    resetCountDown() {
        console.log('clearing timer');
        console.log(this.timer)
        clearTimeout(this.timer)
        console.log(this.timer);
        this.startCountDown();
    }

    setIsAdmin(status: boolean) {
        this.isAdminSubject.next(status);
    }

    logout() {
        this.afAuth.signOut()
            .then((res) => {
                console.log('logged out')
            })
            .catch(err => console.log(err));

    }
    logOutAndNavigateToLogin() {
        this.timer = null;
        this.logout()
        this.router.navigateByUrl('/admin/login')
        alert('You are automatically logged out due to inactivity. Please log in again')
    }

    // checkTimeOut() {
    //     // console.log('checkTimeOut')
    //     setTimeout(
    //         () => {
    //             // this.userInactive.next("You are logged out due to inactivity of 15 minutes. Please log in again"), 1000 * 60 * 10;
    //             // this.generalStore.setAllToNull();
    //             alert("You are logged out due to inactivity of 15 minutes. Please log in again");
    //             this.logout();
    //         }, 1000 * 60 * 15
    //     );
    // }
}
