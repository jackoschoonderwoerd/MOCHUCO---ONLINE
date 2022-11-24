import { Component, OnInit } from '@angular/core';

import { SwUpdate } from '@angular/service-worker';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Mochuco';


    constructor(
        private swUpdate: SwUpdate,

    ) { }

    ngOnInit(): void {

        if (this.swUpdate.isEnabled) {
            this.swUpdate.versionUpdates.subscribe(() => {
                if (confirm('New version available. Load new version?')) {
                    window.location.reload();
                }
            });
        }
    }
}

