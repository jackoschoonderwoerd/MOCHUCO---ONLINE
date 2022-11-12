import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { VenuesService } from '../../../venues.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from 'src/app/shared/confirm-delete/confirm-delete.component';
import { Item, ItemByLanguage } from 'src/app/shared/models';
import { ThisReceiver } from '@angular/compiler';
import { ItemDetailsService } from '../item-details.service';

import { DomSanitizer } from '@angular/platform-browser';
import { ItemAudioService } from './item-audio.service';

@Component({
    selector: 'app-item-audio',
    templateUrl: './item-audio.component.html',
    styleUrls: ['./item-audio.component.scss']
})
export class ItemAudioComponent implements OnInit {

    audioSrc: any;
    file: File;
    itemId: string;
    venueId: string;
    language: string;
    isStoring: boolean = false;

    isLoading: boolean = false
    constructor(
        private dialog: MatDialog,
        private itemAudioService: ItemAudioService,
        public sanitizer: DomSanitizer,
        private dialogRef: MatDialogRef<ItemAudioComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { }

    ngOnInit(): void {
        this.venueId = this.data.venueId
        this.itemId = this.data.itemId;
        this.language = this.data.language
        console.log(this.venueId, this.itemId, this.language)
    }



    onFileInputChange(e) {
        var fileReader = new FileReader()
        this.file = e.target.files[0]
        fileReader.readAsDataURL(this.file)
        fileReader.onload = () => {
            this.audioSrc = fileReader.result;
        }
    }
    onConfirm() {
        this.isStoring = true
        this.itemAudioService.storeAudio(this.itemId, this.venueId, this.language, this.file)
            .then((audioUrl: string) => {
                this.isStoring = false;
                this.dialogRef.close(audioUrl)

            })
    }


    onDeleteAudio() {
        //     const dialogRef = this.dialog.open(ConfirmDeleteComponent, { data: { message: 'this will permanetly delete the audio file' } })
        //     dialogRef.afterClosed().subscribe((res) => {
        //         if (res) {
        //             this.venuesService.deleteAudio(this.venueId, this.itemId, this.language)
        //                 .then(res => {
        //                     this.audioUrl = null;
        //                     this.fileInputChanged.emit(null)
        //                 });
        //         }
        //         return;
        //     })
    }
}
