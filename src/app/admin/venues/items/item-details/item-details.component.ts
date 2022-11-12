import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item, ItemByLanguage, Venue } from 'src/app/shared/models';
import { VenuesService } from '../../venues.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ItemLS } from '../../../../shared/models';
import { Observable } from 'rxjs';

import { LanguageService } from '../../../../shared/language.service';
import { ItemDetailsService } from './item-details.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../../../../shared/confirm-delete/confirm-delete.component';
import { DescriptionComponent } from './description/description.component';
import { ItemImageComponent } from './item-image/item-image.component';
import { ItemAudioComponent } from './item-audio/item-audio.component';


@Component({
    selector: 'app-item-details',
    templateUrl: './item-details.component.html',
    styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {


    availableLanguages: string[]
    form: FormGroup;
    imageUrl: string;
    audioUrl: string;
    description: string;
    editmode: boolean = false;
    unsaved: boolean = false;
    venueId: string;


    @ViewChild('audioFileInput') private audioFileInput: ElementRef;
    @ViewChild('imageFileInput') private imageFileInput: ElementRef;


    constructor(
        private route: ActivatedRoute,
        private venuesService: VenuesService,
        private fb: FormBuilder,
        private languageService: LanguageService,
        private router: Router,
        public itemDetailsService: ItemDetailsService,
        public sanitizer: DomSanitizer,
        private dialog: MatDialog) { }

    ngOnInit(): void {
        this.initForm();
        this.route.params.subscribe((params: any) => {
            this.venueId = params.venueId;
        })
        this.availableLanguages = this.languageService.getLanguages();
        this.form.valueChanges.subscribe((data) => {
            this.unsaved = true;
        })
    }

    initForm() {
        this.form = this.fb.group({
            language: new FormControl(null, [Validators.required]),
            isMainPage: new FormControl(null),
            itemName: new FormControl(null, [Validators.required]),
        })
    }

    onImage() {
        const dialogRef = this.dialog.open(ItemImageComponent)
        dialogRef.afterClosed().subscribe((imageUrl: string) => {
            this.imageUrl = imageUrl;
            this.unsaved = true;
        })
    }
    onAudio() {
        const dialogRef = this.dialog.open(ItemAudioComponent);
        dialogRef.afterClosed().subscribe((audioUrl: string) => {
            this.audioUrl = audioUrl;
            this.unsaved = true
        })
    }

    onDescription() {
        const dialogRef = this.dialog.open(DescriptionComponent, { data: { description: this.description } })
        dialogRef.afterClosed().subscribe((description: string) => {
            this.unsaved = true;
            this.description = description
        })
    }

    onSubmit() {
        // if (!this.editmode) {
        //     const itemLS: ItemLS = {
        //         name: this.form.value.name,
        //         description: this.description,
        //         audioUrl: this.audioUrl
        //     }
        //     const itemByLanguage: ItemByLanguage = {
        //         language: this.form.value.langugage,
        //         itemLS: itemLS
        //     }
        //     const item: Item = {
        //         isMainPage: this.form.value.isMainPage,
        //         imageUrl: this.imageUrl,
        //         itemsByLanguage: [itemByLanguage]
        //     }
        //     this.venuesService.addItemToVenue(this.venueId, item)
        // }
    }

    checkForMainPage() {
        // const mainPagesPresent = this.venue.items.filter((item: Item) => {
        //     return item.isMainPage
        // })
        // this.mainPagePresent = (mainPagesPresent.length > 0);
    }
    onVenues() {
        this.router.navigate(['/admin/venues']);
    }


    onLanguageSelectionChange(e) {

    }










    createItem() {

        // const formData = this.form.value;
        // const language = formData.language;
        // const itemName = formData.name;
        // const itemDescription = formData.description;
        // const isMainPage = formData.isMainPage;
        // const itemLs: ItemLS = {
        //     name: itemName,
        //     description: itemDescription,

        // }
        // const itemByLanguage: ItemByLanguage = {
        //     language: language,
        //     itemLS: itemLs
        // }
        // const item: Item = {

        //     isMainPage: isMainPage,

        //     itemsByLanguage: [itemByLanguage]
        // }
        // return item
    }


    updateLocalStorage(venue) {
        localStorage.setItem('activeVenue', JSON.stringify(venue));

    }



}
