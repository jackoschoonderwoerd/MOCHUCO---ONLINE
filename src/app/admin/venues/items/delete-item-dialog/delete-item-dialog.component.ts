import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-item-dialog',
    templateUrl: './delete-item-dialog.component.html',
    styleUrls: ['./delete-item-dialog.component.scss']
})
export class DeleteItemDialogComponent implements OnInit {

    form: FormGroup;
    buttonDisabled: boolean = true

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<DeleteItemDialogComponent>
    ) { }

    ngOnInit(): void {
        this.initForm()
        this.form.valueChanges.subscribe((formData: any) => {
            if (formData.image && formData.audioFragments && formData.descriptions) {
                this.buttonDisabled = false;
            } else {
                this.buttonDisabled = true
            }
        })
    }
    initForm() {
        this.form = this.fb.group({
            image: new FormControl(null),
            audioFragments: new FormControl(null),
            descriptions: new FormControl(null)
        })
    }
    onDeleteItem() {
        this.dialogRef.close(true)
    }
    onCancel() {
        this.dialogRef.close(false);
    }
}
