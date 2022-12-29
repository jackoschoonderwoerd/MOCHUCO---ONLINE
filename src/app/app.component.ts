import { Component, OnInit, HostListener } from '@angular/core';

import { SwUpdate } from '@angular/service-worker';
import { AuthService } from './admin/auth/auth.service';
import {
    Auth
} from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UiService } from './shared/ui.service';
import { MochucoUser } from './admin/auth/mochuco-user.model';
import { GeneralStoreService } from './shared/general-store.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Mochuco';
    timeoutId;
    userInactive: Subject<any> = new Subject();



    constructor(
        private swUpdate: SwUpdate,
        public authService: AuthService,
        private afAuth: Auth,
        private router: Router,
        private uiService: UiService,
        private generalStore: GeneralStoreService

    ) {
        // const subscripion = this.authService.mochucoUser$.subscribe((mochucoUser: MochucoUser) => {
        //     console.log(mochucoUser)
        //     if (mochucoUser) {
        //         subscripion.unsubscribe();
        //         this.checkTimeOut();
        //         // this.userInactive.subscribe((message) => {
        //         //     alert(message);
        //         //     this.authService.logout()
        //         // }
        //         // );
        //     }
        // })
    }

    ngOnInit(): void {

        if (this.swUpdate.isEnabled) {
            this.swUpdate.versionUpdates.subscribe(() => {
                if (confirm('New version available. Load new version?')) {
                    window.location.reload();
                }
            });
        }
        if (localStorage.getItem('mochucoUser')) {
            const mochucoUser: MochucoUser = JSON.parse(localStorage.getItem('mochucoUser'));

            this.authService.logIn(mochucoUser).subscribe((data) => {
                console.log(data);
            })
            this.authService.setIsLoggedIn(true);

            const now = new Date()
            if (now.getTime() > mochucoUser.expiry) {
                localStorage.removeItem('mochucoUserItem');
                console.log('LS expired')
            } else {

                this.authService.logIn(mochucoUser)
                    .subscribe((data) => {
                        // console.log(data);
                        console.log('LOGGED IN BY LS');
                    })

            }
        } else {
            console.log('NO EXISTING USER IN LS');
        }

    }


    @HostListener('window:keydown')
    @HostListener('window:mousedown') checkUserActivity() {
        // console.log('clearing timeout')
        clearTimeout(this.timeoutId);
        // console.log(this.timeoutId);
        // this.checkTimeOut();
    }



}

