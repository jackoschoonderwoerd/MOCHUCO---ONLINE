// /(?!.*<h5>)(?!.*<\/h5>)(?!.*<p>)(?!.*<\/p>)(<([^>]+)>)/ig, ''

import { Component, OnInit, ViewChild, ElementRef, Inject, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Venue, ItemLS, ItemByLanguage } from '../../../../../shared/models';
import { VenuesService } from '../../../venues.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ItemDetailsService } from '../item-details.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { InjectFlags } from '@angular/compiler/src/core';
import { ConfirmDeleteComponent } from 'src/app/shared/confirm-delete/confirm-delete.component';

@Component({
    selector: 'app-description',
    templateUrl: './description.component.html',
    styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {

    form: FormGroup;
    // description: string = '';
    unwantedTagsRemoved: string;
    range;
    inputRange;
    selectedString: string;
    selectedAreaStart: number;
    selectedAreaEnd: number;
    textAreaHeight;
    submitDisabled: boolean = false;
    description: string;
    name: string

    @ViewChild('textarea') private textarea: ElementRef;
    @ViewChild('textarea') private output: ElementRef;
    // @Output() description = new EventEmitter<string>();
    // @Input() description: string;

    itemId: string;
    venue: Venue;
    language: string;
    itemIndex: number;
    itemByLanguageIndex: number;


    constructor(
        private route: ActivatedRoute,
        private itemDetailsService: ItemDetailsService,
        private venuesService: VenuesService,
        private router: Router,
        private fb: FormBuilder,
        private dialogref: MatDialogRef<DescriptionComponent>,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) private data: any

    ) { }

    ngOnInit(): void {
        this.initForm()
        console.log(this.data)
        this.description = this.data.description;
        this.form.patchValue({
            description: this.description
        })
        this.route.params.subscribe((params: any) => {
            this.itemId = params.itemId;
            this.language = params.language;
            this.itemIndex = params.itemIndex;
            this.itemByLanguageIndex = params.itemByLanguageIndex;
            this.name = params.name;
        });
        this.venuesService.activeVenue$.subscribe((venue: Venue) => {
            this.venue = venue
        })
    }

    initForm() {
        this.form = this.fb.group({
            description: new FormControl(null)
        })
    }

    textareaClicked() {
        this.selectedAreaStart = this.textarea.nativeElement.selectionStart;
        this.selectedAreaEnd = this.textarea.nativeElement.selectionEnd;

    }

    addHeader() {
        const cursorStart = this.textarea.nativeElement.selectionStart;
        const cursorEnd = this.textarea.nativeElement.selectionEnd;
        console.log(cursorStart, cursorEnd)
        let currentValue = this.textarea.nativeElement.value;
        let patchedValue = currentValue.substr(
            0, cursorStart) +
            '\n<h5>YOUR HEADER</h5>\n' +
            currentValue.substr(cursorEnd
            )
        this.textarea.nativeElement.value = patchedValue;
        this.description = patchedValue.replace(

            /(?!.*<h5>)(?!.*<\/h5>)(<([^>]+)>)/ig, ''
        );
        this.adjustTextareaHeight();
        // this.selectedAreaStart = 0;
        // this.selectedAreaEnd = 0;

        currentValue = null;
        this.setCaretPosition(cursorEnd)
    }

    setCaretPosition(cursorEnd) {
        console.log(cursorEnd);
        // IE >= 9 and other browsers
        if (this.textarea.nativeElement.setSelectionRange) {
            this.textarea.nativeElement.focus();
            this.textarea.nativeElement.setSelectionRange(cursorEnd + 22, cursorEnd + 22);
        }
        // IE < 9
        // else if (ctrl.createTextRange) {
        //     var range = ctrl.createTextRange();
        //     range.collapse(true);
        //     range.moveEnd('character', end);
        //     range.moveStart('character', start);
        //     range.select();
        // }

    }


    textareaKeyUp() {
        console.log(this.textarea.nativeElement.selectionStart);
        this.description = this.textarea.nativeElement.value.replace(
            // /(?!.*<h5>)(?!.*<\/h5>)(?!.*<p>)(?!.*<\/p>)(<([^>]+)>)/ig, ''
            /(?!.*<h5>)(?!.*<\/h5>)(<([^>]+)>)/ig, ''
        );
        this.adjustTextareaHeight();
        this.onCheckForHeaderLength()
    }

    adjustTextareaHeight() {
        this.form.valueChanges.subscribe(value => {
            console.log('change detected')
            this.textarea.nativeElement.style.height = 'auto'
            this.textarea.nativeElement.style.height = `${this.textarea.nativeElement.scrollHeight}px`
        })

    }

    onCheckForHeaderLength() {
        var indicesH5start = [];
        var indicesH5end = [];
        var indices = [];
        var tagsInvalid: boolean = false;
        var tagsToLong: boolean = false;
        for (var pos = this.description.indexOf('<h5>'); pos !== -1; pos = this.description.indexOf('<h5>', pos + 1)) {
            indicesH5start.push(pos);
            indices.push(pos);
        }
        for (var pos = this.description.indexOf('</h5>'); pos !== -1; pos = this.description.indexOf('</h5>', pos + 1)) {
            indicesH5end.push(pos);
            indices.push(pos);
        }
        if (indicesH5start.length != indicesH5end.length) {
            tagsInvalid = true
            alert('open h5 tag')
        } else {

        }
        for (let i = 0; i < indicesH5start.length; i++) {
            if (indicesH5end[i] - indicesH5start[i] > 25) {
                tagsToLong = true
                alert('a header can contain a maximum of 25 characters')
            } else {

            }
        }
        if (tagsInvalid || tagsToLong) {
            this.submitDisabled = true;
        } else {
            this.submitDisabled = false;
        }

    }

    onSubmit() {
        this.dialogref.close(this.form.value.description);
    }
    onCancel() {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, { data: { message: 'All your edits will be lost' } });
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.dialogref.close();
            }
            return;
        })
    }
}
