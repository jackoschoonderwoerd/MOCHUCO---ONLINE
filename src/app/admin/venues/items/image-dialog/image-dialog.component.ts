import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-image-dialog',
    templateUrl: './image-dialog.component.html',
    styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {


    imageUrl: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ImageDialogComponent>
    ) { }

    ngOnInit(): void {
        this.imageUrl = this.data.imageUrl;
        this.dialogRef.updateSize(
            "50vw", "auto"
        )

    }
    onClose() {
        this.dialogRef.close();
    }
}
