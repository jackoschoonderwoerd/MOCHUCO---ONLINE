import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { VenuesService } from '../../../venues.service';
import { ConfirmDeleteComponent } from '../../../../../shared/confirm-delete/confirm-delete.component';
import { Item } from 'src/app/shared/models';
import { ItemDetailsService } from '../../item-details/item-details.service';
import { ItemImageService } from './item-image.service';

@Component({
    selector: 'app-item-image',
    templateUrl: './item-image.component.html',
    styleUrls: ['./item-image.component.scss']
})
export class ItemImageComponent implements OnInit {

    file: File;
    imageSrc: any;
    venueId: string;
    itemId: string;

    @ViewChild('fileInput') fileInput: ElementRef;

    @Output() fileInputChanged: EventEmitter<string> = new EventEmitter()





    constructor(
        private venuesService: VenuesService,
        private dialog: MatDialog,
        public itemDetailsService: ItemDetailsService,
        private dialogRef: MatDialogRef<ItemImageComponent>,
        private itemImageService: ItemImageService,
        @Inject(MAT_DIALOG_DATA) private data: any) { }
    ngOnInit(): void {
        this.venueId = this.data.venueId;
        this.itemId = this.data.itemId;
    }

    onFileInputChange(e) {
        var fileReader = new FileReader();
        this.file = e.target.files[0]
        fileReader.readAsDataURL(this.file)
        fileReader.onload = () => {
            this.imageSrc = fileReader.result;
        }
    }
    onConfirm() {
        this.itemImageService.storeImage(this.venueId, this.itemId, this.file)
            .then((url: string) => {
                this.dialogRef.close(url)
            })
    }

    onDeleteImage() {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, { data: { message: 'this will permanently remove the image from the db' } })
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.venuesService.deleteImage(this.venueId, this.itemId)
                    .then(res => {
                        console.log('image deleted')
                        this.fileInputChanged.emit('')
                    })
                    .catch(err => console.log(err));
            }
            return;
        })
    }
}
