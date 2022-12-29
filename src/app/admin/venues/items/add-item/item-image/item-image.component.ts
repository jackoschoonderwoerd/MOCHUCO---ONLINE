import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { VenuesService } from '../../../venues.service';
import { ConfirmDeleteComponent } from '../../../../../shared/confirm-delete/confirm-delete.component';
import { Item } from 'src/app/shared/models';
import { ItemDetailsService } from '../../item-details/item-details.service';
import { ItemImageService } from './item-image.service';
import { WarningComponent } from '../../../../../shared/warning/warning.component';

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
    imageUrl: string;
    editmode: boolean = false;

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
        console.log(this.data)
        this.venueId = this.data.venueId;
        this.itemId = this.data.itemId;

        if (this.data.imageUrl != undefined) {
            this.imageUrl = this.data.imageUrl
            this.editmode = true;
        }
    }

    onFileInputChange(e) {
        if (this.imageUrl) {
            this.imageUrl = null;
        }
        if (this.imageSrc) {
            this.imageSrc = null;
        }
        const filename = e.target.files[0].name;
        const ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        if (ext !== 'jpg' && ext !== 'png' && ext !== 'jpeg' && ext !== 'webp') {
            this.dialog.open(WarningComponent, { data: { message: 'wrong filetype, only files ending on \'jpg\' or \'png\' or \'webp\' are allowed' } })
            this.dialogRef.close()
        } else {
            var fileReader = new FileReader();
            this.file = e.target.files[0]
            fileReader.readAsDataURL(this.file)
            fileReader.onload = () => {
                this.imageSrc = fileReader.result;

            }
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
                if (this.editmode) {
                    this.itemImageService.removeImageFromStorage(this.venueId, this.itemId)
                        .then(res => {
                            console.log('image removed from storage');
                            this.itemImageService.removeImageUrlFromDB(this.venueId, this.itemId)
                                .then(res => {
                                    console.log('image removed from DB')
                                    this.dialogRef.close()
                                })
                                .catch(err => console.log(err));
                        })

                }
            }
            return;
        })
    }
    onCancel() {
        this.dialogRef.close()
    }
}
