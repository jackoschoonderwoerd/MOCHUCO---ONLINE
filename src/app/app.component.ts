import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

import { ScannerService } from './pages/scanner/scanner.service';
import { SwUpdate } from '@angular/service-worker';
import { MochucoComponent } from './pages/mochuco/mochuco.component';
import { TestComponent } from './pages/test/test.component';
import { UiService } from './shared/ui.service';
// import { LocationsService } from './admin/locations/locations.service';


import { VenuesService } from './admin/venues/venues.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Mochuco';
    output!: string;

    constructor(
        private route: ActivatedRoute,
        private scannerService: ScannerService,
        private swUpdate: SwUpdate,

    ) { }

    ngOnInit(): void {
        // this.getIds()

        // this.route.queryParamMap.subscribe((queryParamMap: any) => {
        //     if (queryParamMap.params.venueId && queryParamMap.params.objectId) {
        //         const venueId = queryParamMap.params.venueId;
        //         const objectId = queryParamMap.params.objectId;

        //         this.scannerService.setIsInApp(true);
        //     }
        // });
        // if (this.swUpdate.isEnabled) {
        //     this.swUpdate.versionUpdates.subscribe(() => {
        //         if (confirm('New version available. Load new version?')) {
        //             window.location.reload();
        //         }
        //     });
        // }
    }
    getIds() {
        // const str = 'https://mochuco-offline-b06e7.web.app/item?venueId=7hrSoYPo0e82iJWG7IYp&itemId=1665579006502'
        // const start = str.split('?')[1];
        // const myArray = start.split('&');
        // const venueId = myArray[0].split('=')[1];
        // const itemId = myArray[1].split('=')[1]
    }
}

