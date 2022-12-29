// /(?!.*<h5>)(?!.*<\/h5>)(?!.*<p>)(?!.*<\/p>)(<([^>]+)>)/ig, ''

import { Component, OnInit, ViewChild, ElementRef, Inject, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Venue, ItemLS, ItemByLanguage } from '../../../../../../../shared/models';
import { VenuesService } from '../../../../../venues.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ItemDetailsService } from '../../../../item-details/item-details.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { InjectFlags } from '@angular/compiler/src/core';
import { ConfirmDeleteComponent } from 'src/app/shared/confirm-delete/confirm-delete.component';
import { GeneralStoreService } from 'src/app/shared/general-store.service';

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
    initialDescription: string;
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
        private dialogRef: MatDialogRef<DescriptionComponent>,
        private dialog: MatDialog,
        private generalStore: GeneralStoreService,
        @Inject(MAT_DIALOG_DATA) private data: any

    ) { }

    ngOnInit(): void {
        this.textAreaHeight = '100vh'
        this.initForm()
        console.log(this.data)
        this.initialDescription = this.data.description;
        this.description = this.initialDescription;
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
        this.generalStore.activeVenue$.subscribe((venue: Venue) => {
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

            /(?!.*<br>)(?!.*<p>)(?!.*<\/p>)(?!.*<h5>)(?!.*<\/h5>)(<([^>]+)>)/ig, ''
        );
        this.adjustTextareaHeight();
        // this.selectedAreaStart = 0;
        // this.selectedAreaEnd = 0;

        currentValue = null;
        this.setCaretPosition(cursorEnd, 21)
    }
    addParagraph() {
        const cursorStart = this.textarea.nativeElement.selectionStart;
        const cursorEnd = this.textarea.nativeElement.selectionEnd;
        console.log(cursorStart, cursorEnd)
        let currentValue = this.textarea.nativeElement.value;
        let patchedValue = currentValue.substr(
            0, cursorStart) +
            '\n<p>YOUR PARAGRAPH</p>\n' +
            currentValue.substr(cursorEnd)
        this.textarea.nativeElement.value = patchedValue;
        this.description = patchedValue.replace(

            /(?!.*<br>)(?!.*<p>)(?!.*<\/p>)(?!.*<h5>)(?!.*<\/h5>)(<([^>]+)>)/ig, ''
        );
        this.adjustTextareaHeight();
        // this.selectedAreaStart = 0;
        // this.selectedAreaEnd = 0;

        currentValue = null;
        this.setCaretPosition(cursorEnd, 22)
    }
    addLineBreak() {
        console.log('adding linebreak')
        const cursorStart = this.textarea.nativeElement.selectionStart;
        console.log(cursorStart)
        const cursorEnd = this.textarea.nativeElement.selectionEnd;
        console.log(cursorEnd)
        let currentValue = this.textarea.nativeElement.value;
        let patchedValue = currentValue.substr(
            0, cursorStart) +
            '<br>\n' +
            currentValue.substr(cursorEnd)
        this.textarea.nativeElement.value = patchedValue;
        this.description = patchedValue.replace(
            /(?!.*<br>)(?!.*<p>)(?!.*<\/p>)(?!.*<h5>)(?!.*<\/h5>)(<([^>]+)>)/ig, ''
        );
        this.setCaretPosition(cursorEnd, 4)
        // this.textarea.nativeElement.setSelectionRange()

    }
    textareaKeyUp(event) {
        // console.log(event);
        // console.log(event.location);
        // console.log(event.code);
        // console.log(this.textarea.nativeElement.selectionEnd)
        if (event.code === 'Enter') {
            console.log('ENTER')
            console.log(event.location)
            this.addLineBreak()
        }
        // console.log(this.textarea.nativeElement.selectionStart);
        this.description = this.textarea.nativeElement.value.replace(
            // /(?!.*<h5>)(?!.*<\/h5>)(?!.*<p>)(?!.*<\/p>)(<([^>]+)>)/ig, ''
            /(?!.*<br>)(?!.*<p>)(?!.*<\/p>)(?!.*<h5>)(?!.*<\/h5>)(<([^>]+)>)/ig, ''
        );
        this.adjustTextareaHeight();
        this.onCheckForHeaderLength()
    }
    textAreaChanged() {
        console.log('chaNGE')
        // console.log(event);
        // console.log(event.location);
        // console.log(event.code);
        // console.log(this.textarea.nativeElement.selectionEnd)
        // console.log(this.textarea.nativeElement.selectionStart);
        this.description = this.textarea.nativeElement.value.replace(
            // /(?!.*<h5>)(?!.*<\/h5>)(?!.*<p>)(?!.*<\/p>)(<([^>]+)>)/ig, ''
            /(?!.*<br>)(?!.*<p>)(?!.*<\/p>)(?!.*<h5>)(?!.*<\/h5>)(<([^>]+)>)/ig, ''
        );
        this.adjustTextareaHeight();
        this.onCheckForHeaderLength()
    }


    setCaretPosition(cursorEnd, addedPositions) {
        console.log(cursorEnd);
        // IE >= 9 and other browsers
        if (this.textarea.nativeElement.setSelectionRange) {
            this.textarea.nativeElement.focus();
            this.textarea.nativeElement.setSelectionRange(cursorEnd + addedPositions, cursorEnd + addedPositions);
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
        this.dialogRef.close(this.form.value.description);
    }
    onCancel() {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, { data: { message: 'All your edits will be lost' } });
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.dialogRef.close(this.initialDescription);
            }
            return;
        })
    }
}
