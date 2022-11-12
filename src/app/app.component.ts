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
        private router: Router,
        private route: ActivatedRoute,

        private scannerService: ScannerService,
        private dialog: MatDialog,
        private swUpdate: SwUpdate,
        private uiService: UiService,


        private venuesService: VenuesService
        // private locationService: LocationsService
    ) { }

    ngOnInit(): void {
        this.getIds()
        console.log('app init')
        this.venuesService.setActiveVenue(null)
        // if(localStorage.getItem('stage')) {
        //     this.stagesService.setActiveStageFromLS(JSON.parse(localStorage.getItem('stage')))
        // }
        // if (localStorage.getItem('location')) {
        //     this.locationService.setActiveLocation(JSON.parse(localStorage.getItem('location')))
        // }
        // console.log(this.router.url);
        // console.log(this.route.snapshot.queryParamMap);
        this.route.queryParamMap.subscribe((queryParamMap: any) => {
            //   console.log(queryParamMap.params);
            if (queryParamMap.params.venueId && queryParamMap.params.objectId) {
                // console.log('queryParamMap.params.venueId && queryParamMap.params.objectId FOUND')
                const venueId = queryParamMap.params.venueId;
                // console.log('app.component 30 venueId: ', venueId);
                const objectId = queryParamMap.params.objectId;
                // console.log('app.component 32 objectId: ', objectId);

                this.scannerService.setIsInApp(true);
            }
        });
        // this.dialog.open(MochucoComponent, {
        //   maxHeight: '80vh'
        // })
        // this.dialog.open(TestComponent)
        if (this.swUpdate.isEnabled) {
            this.swUpdate.versionUpdates.subscribe(() => {
                if (confirm('New version available. Load new version?')) {
                    window.location.reload();
                }
            });
        }
    }
    getIds() {
        const str = 'https://mochuco-offline-b06e7.web.app/item?venueId=7hrSoYPo0e82iJWG7IYp&itemId=1665579006502'
        const start = str.split('?')[1];
        const myArray = start.split('&');
        const venueId = myArray[0].split('=')[1];
        const itemId = myArray[1].split('=')[1]
    }
}

