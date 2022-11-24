import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-venue-dialog',
    templateUrl: './delete-venue-dialog.component.html',
    styleUrls: ['./delete-venue-dialog.component.scss']
})
export class DeleteVenueDialogComponent implements OnInit {

    form: FormGroup;
    buttonDisabled: boolean = true;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<DeleteVenueDialogComponent>
    ) { }


    ngOnInit(): void {
        this.initForm();
        this.form.valueChanges.subscribe((formData) => {
            if (formData.items && formData.images && formData.audio && formData.descriptions) {
                this.buttonDisabled = false;
            } else {
                this.buttonDisabled = true;
            }
        })
    }
    initForm() {
        this.form = this.fb.group({
            items: new FormControl(null),
            images: new FormControl(null),
            audio: new FormControl(null),
            descriptions: new FormControl(null)
        })
    }

    onDeleteVenue() {
        this.dialogRef.close(true)
    }
    onCancel() {
        this.dialogRef.close(false)
    }
}
