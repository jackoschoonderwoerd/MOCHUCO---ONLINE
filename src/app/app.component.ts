import { Component, OnInit, HostListener } from '@angular/core';

import { SwUpdate } from '@angular/service-worker';
import { AuthService } from './admin/auth/auth.service';
import { Auth } from '@angular/fire/auth';
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
        public afAuth: Auth,
        private router: Router,
        private uiService: UiService,
        private generalStore: GeneralStoreService

    ) { }

    ngOnInit(): void {


        this.afAuth.onAuthStateChanged((user) => {
            console.log(user);
            if (!user) {
                console.log('no user')
                return;
            }
            if (!(user.email === 'jackoboes@gmail.com')) {
                console.log(user.email)
                this.authService.setIsLoggedIn(true);
                this.router.navigateByUrl('/admin/venues')
            } else {
                console.log(user.email);
                this.authService.setIsLoggedIn(true)
                this.authService.setIsAdmin(true);
                this.router.navigateByUrl('/admin/venues')
            }
        })

        if (this.swUpdate.isEnabled) {
            this.swUpdate.versionUpdates.subscribe(() => {
                if (confirm('New version available. Load new version?')) {
                    window.location.reload();
                }
            });
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

