import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import html2canvas from 'html2canvas';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { ItemByLanguage } from 'src/app/shared/models';

@Component({
    selector: 'app-download-qr',
    templateUrl: './download-qr.component.html',
    styleUrls: ['./download-qr.component.scss']
})
export class DownloadQrComponent implements OnInit {


    itemId: string;
    venueId: string;
    itemByLanguage: ItemByLanguage
    @ViewChild('printArea') private printArea: ElementRef

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<DownloadQrComponent>
    ) { }

    ngOnInit(): void {
        this.itemId = this.data.itemId;
        this.venueId = this.data.venueId;
        this.itemByLanguage = this.data.itemByLanguage
    }
    onDownloadQrCode() {
        console.log(this.printArea.nativeElement)
        let DATA: any = this.printArea.nativeElement;
        html2canvas(DATA).then((canvas) => {
            let fileWidth = 210;
            // let fileHeight = 210;
            let fileHeight = (canvas.height * fileWidth) / canvas.width;
            const FILEURI = canvas.toDataURL('image/png');
            let PDF = new jsPDF('p', 'mm', 'a4');

            let position = 0;
            PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
            PDF.save('angular-demo.pdf');
        });

    }
    onCloseDialog() {
        this.dialogRef.close()
    }

}
