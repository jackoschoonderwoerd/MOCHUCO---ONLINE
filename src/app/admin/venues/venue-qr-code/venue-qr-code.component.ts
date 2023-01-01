import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
    selector: 'app-venue-qr-code',
    templateUrl: './venue-qr-code.component.html',
    styleUrls: ['./venue-qr-code.component.scss']
})
export class VenueQrCodeComponent implements OnInit {


    venueName: string;
    venueId: string;

    @ViewChild('printarea') private printarea: ElementRef

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { }

    ngOnInit(): void {
        this.venueId = this.data.venueId
        this.venueName = this.data.venueName
    }
    onDownloadQrCode() {
        console.log(this.printarea.nativeElement, '/////?????')
        let DATA: any = this.printarea.nativeElement;
        html2canvas(DATA).then((canvas) => {
            let fileWidth = 210;
            // let fileHeight = 210;
            let fileHeight = (canvas.height * fileWidth) / canvas.width;
            const FILEURI = canvas.toDataURL('image/png');
            let PDF = new jsPDF('p', 'mm', 'a4');

            let position = 0;
            PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
            PDF.save(this.venueName);
        });
    }

}
