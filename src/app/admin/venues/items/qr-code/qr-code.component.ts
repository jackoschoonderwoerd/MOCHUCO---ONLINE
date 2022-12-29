import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { VenuesService } from '../../venues.service';
import { Venue } from '../../../../shared/models';

@Component({
    selector: 'app-qr-code',
    templateUrl: './qr-code.component.html',
    styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {

    itemId: string;
    venueId: string;
    itemName: string;
    local: boolean = false;
    localLink: string;
    remoteLink: string;
    venue: Venue;
    @ViewChild('printarea') private printarea: ElementRef

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        public venuesService: VenuesService
    ) { }

    ngOnInit(): void {
        console.log(this.data)
        this.venueId = this.data.venueId;
        this.venuesService.getVenueById(this.venueId).subscribe((venue: Venue) => {
            this.venue = venue
        })
        this.itemId = this.data.itemId;
        this.itemName = this.data.itemName
        this.local = this.data.local
        this.localLink = `http://localhost:4200/item?venueId=${this.venueId}&itemId=${this.itemId}`

    }

    onDownloadQrCode() {
        console.log(this.printarea.nativeElement)
        let DATA: any = this.printarea.nativeElement;
        html2canvas(DATA).then((canvas) => {
            let fileWidth = 210;
            // let fileHeight = 210;
            let fileHeight = (canvas.height * fileWidth) / canvas.width;
            const FILEURI = canvas.toDataURL('image/png');
            let PDF = new jsPDF('p', 'mm', 'a4');

            let position = 0;
            PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
            PDF.save(this.itemName);
        });
    }
}
