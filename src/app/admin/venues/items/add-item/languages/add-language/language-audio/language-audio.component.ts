import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { VenuesService } from '../../../../../venues.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from 'src/app/shared/confirm-delete/confirm-delete.component';
import { Item, ItemByLanguage } from 'src/app/shared/models';
import { ThisReceiver } from '@angular/compiler';
import { ItemDetailsService } from '../../../../item-details/item-details.service';

import { DomSanitizer } from '@angular/platform-browser';
import { ItemAudioService } from './item-audio.service';
import { WarningComponent } from '../../../../../../../shared/warning/warning.component';


@Component({
    selector: 'app-item-audio',
    templateUrl: './language-audio.component.html',
    styleUrls: ['./language-audio.component.scss']
})
export class LanguageAudioComponent implements OnInit {

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
        private dialogRef: MatDialogRef<LanguageAudioComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { }

    ngOnInit(): void {

        this.venueId = this.data.venueId
        this.itemId = this.data.itemId;
        this.language = this.data.language
        console.log(this.venueId, this.itemId, this.language)
    }



    onFileInputChange(e) {
        const filename: string = e.target.files[0].name;
        const ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        if (ext != 'mp3') {
            this.dialog.open(WarningComponent, { data: { message: 'wrong filetype, only files ending on \'mp3\' are allowed' } })
            this.dialogRef.close();
        } else {
            var fileReader = new FileReader()
            this.file = e.target.files[0]
            fileReader.readAsDataURL(this.file)
            fileReader.onload = () => {
                this.audioSrc = fileReader.result;
            }
        }
    }

    onConfirmSelection() {
        this.isStoring = true
        this.itemAudioService.storeAudio(this.venueId, this.itemId, this.language, this.file)
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
