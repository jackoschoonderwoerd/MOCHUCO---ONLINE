import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DownloadQrComponent } from './download-qr/download-qr.component';
import { ItemByLanguage } from '../../../../../shared/models';

@Component({
    selector: 'app-item-qr',
    templateUrl: './item-qr.component.html',
    styleUrls: ['./item-qr.component.scss']
})
export class ItemQrComponent implements OnInit {

    @Input() venueId: string;
    @Input() itemId: string;
    @Input() itemByLanguage: ItemByLanguage;

    constructor(private dialog: MatDialog) { }

    ngOnInit(): void {
        console.log(this.venueId, this.itemId)
    }
    onDownloadQr() {
        this.dialog.open(DownloadQrComponent, {
            data:
            {
                venueId: this.venueId,
                itemId: this.itemId,
                itemByLanguage: this.itemByLanguage
            }
        }
        )
    }
}
