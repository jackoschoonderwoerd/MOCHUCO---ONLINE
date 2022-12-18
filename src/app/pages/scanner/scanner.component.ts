import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ScannerService } from './scanner.service';


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



    constructor(
        private router: Router,
        private scannerService: ScannerService,
    ) { }

    ngOnInit(): void {

        this.scannerService.setIsScanning(true);
        // this.cameraButton.nativeElement.click();
        document.getElementById("cameraButton").click();
    }

    onData(event: string) {
        if (!event) {
            return;
        }
        const url = new URL(event)
        const queryParameters = url.searchParams;
        const venueId = queryParameters.get('venueId')
        const itemId = queryParameters.get('itemId')
        this.router.navigate(['item'], { queryParams: { venueId: venueId, itemId: itemId } });
        return;
    }

    onError(e: any): void {
        console.log(e);
    }

    ngOnDestroy(): void {
        this.scannerService.setIsScanning(false);
    }
    onCancel() {
        window.history.back();
    }
}
