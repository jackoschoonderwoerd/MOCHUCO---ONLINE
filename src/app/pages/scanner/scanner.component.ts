import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ScannerService } from './scanner.service';
import { UiService } from '../../shared/ui.service';
import { MatDialog } from '@angular/material/dialog';
import { UiDialogComponent } from '../../shared/ui-dialog/ui-dialog.component';

@Component({
    selector: 'app-scanner',
    templateUrl: './scanner.component.html',
    styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit, OnDestroy {


    @ViewChild('scanner') scanner: ElementRef<HTMLElement>
    @ViewChild('cameraButton') cameraButton: ElementRef<HTMLElement>
    title = 'Mochuco';
    output!: string;
    isInApp: boolean = false;

    requestedVenueId: string;
    requestedObjectId: string;

    constructor(
        private router: Router,

        private route: ActivatedRoute,
        private scannerService: ScannerService,
        private uiService: UiService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {

        this.scannerService.setIsScanning(true);
        // this.cameraButton.nativeElement.click();
        document.getElementById("cameraButton").click();

        const stage = window.location.href
        const headRemoved = stage.split('//')[1]
        const headAndTailRemoved = headRemoved.split('/')[0]

    }


    onError(e: any): void {
        alert(e);
    }
    onData(event: string) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position);
            })
        }
        if (event) {
            // this.router.navigateByUrl('mochuco')
            alert(event)
            const start = event.split('?')[1];
            console.log('start: ', start);
            const myArray = start.split('&')
            console.log('myArray: ', myArray);
            const venueId = myArray[0].split('=')[1];
            const itemId = myArray[1].split('=')[1]
            console.log('itemId: ', itemId)
            this.router.navigate(['item'], { queryParams: { venueId: venueId, itemId: itemId } })
            // this.router.navigate(['item'])













            // this.scannerService.isInApp$.subscribe((isInApp: boolean) => {
            //     if (!isInApp) {
            //         alert('not in app')

            //         var open = window.open(event);
            //         if (open == null || typeof (open) == 'undefined') {

            //             alert(`
            //                     "Turn off your pop-up blocker!\n\n
            //                     Settins => Safari => Block Pop-ups`)
            //         }
            //         return;

            //     }
            // })
            // this.scannerService.setIsScanning(false);
        } else {
            alert('no data')
        }
    }

    ngOnDestroy(): void {
        this.scannerService.setIsScanning(false);
    }
}
