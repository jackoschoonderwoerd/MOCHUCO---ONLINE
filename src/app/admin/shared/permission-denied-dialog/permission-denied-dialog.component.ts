import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-permission-denied-dialog',
    templateUrl: './permission-denied-dialog.component.html',
    styleUrls: ['./permission-denied-dialog.component.scss']
})
export class PermissionDeniedDialogComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<PermissionDeniedDialogComponent>
    ) { }

    ngOnInit(): void {
        this.dialogRef.updateSize(
            '300px', 'auto'
        )
    }

    onClose() {
        this.dialogRef.close();
    }
}
