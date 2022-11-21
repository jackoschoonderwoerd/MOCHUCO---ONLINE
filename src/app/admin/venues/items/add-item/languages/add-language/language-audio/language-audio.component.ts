import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { DomSanitizer } from '@angular/platform-browser';
import { LanguageAudioService } from './language-audio.service';
import { WarningComponent } from '../../../../../../../shared/warning/warning.component';
import { ConfirmDeleteComponent } from '../../../../../../../shared/confirm-delete/confirm-delete.component';


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
    audioUrl: string;
    editmode: boolean = false

    isLoading: boolean = false
    constructor(
        private dialog: MatDialog,
        private languageAudioService: LanguageAudioService,
        public sanitizer: DomSanitizer,
        private dialogRef: MatDialogRef<LanguageAudioComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { }

    ngOnInit(): void {

        this.venueId = this.data.venueId
        this.itemId = this.data.itemId;
        this.language = this.data.language;
        if (this.data.audioUrl) {
            this.audioUrl = this.data.audioUrl;
            this.editmode = true
        }
        console.log(this.venueId, this.itemId, this.language, this.audioUrl)
    }



    onFileInputChange(e) {
        const filename: string = e.target.files[0].name;
        const ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        if (ext != 'mp3') {
            this.dialog.open(WarningComponent, { data: { message: 'wrong filetype, only files ending on \'mp3\' are allowed' } })
            this.dialogRef.close();
        } else {
            this.audioSrc = null;
            this.audioUrl = null;
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
        this.languageAudioService.storeAudio(this.venueId, this.itemId, this.language, this.file)
            .then((audioUrl: string) => {
                this.isStoring = false;
                this.dialogRef.close(
                    {
                        action: 'audio added',
                        audioUrl: audioUrl
                    })
            })
    }



    onDeleteAudio() {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
            data: {
                message: 'this will permanetly delete the audio file'
            }
        })
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.languageAudioService.removeAudioFromStorage(this.venueId, this.itemId, this.language)
                    .then(res => {
                        {
                            console.log('audio removed formstorage')
                            this.languageAudioService.removeAudioFromDb(this.venueId, this.itemId, this.language);
                        }
                    })
                    .then(() => {
                        this.languageAudioService.removeAudioFromDb(this.venueId, this.itemId, this.language)
                    })
                    .then(res => {
                        console.log('audioUrl removed from DB')
                        this.dialogRef.close(
                            { action: 'audio removed' }
                        );
                    })
                    .catch(err => console.log(err));
            }
        })

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
