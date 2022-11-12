import { importExpr } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-delete',
    templateUrl: './confirm-delete.component.html',
    styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {

    constructor(
        private dialogRef: MatDialogRef<ConfirmDeleteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {

    }
    ngOnInit(): void {
        this.dialogRef.updateSize(
            "300px", "auto"
        )
    }


    onConfirm(): void {
        this.dialogRef.close(true)
    }
    onCancel(): void {
        this.dialogRef.close()
    }

}
