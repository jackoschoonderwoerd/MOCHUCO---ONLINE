import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LanguageService } from 'src/app/shared/language.service';
import { MatDialog } from '@angular/material/dialog';
import { DescriptionComponent } from '../../../item-details/description/description.component';
import { VenuesService } from '../../../../venues.service';
import { Item, ItemByLanguage, ItemLS } from '../../../../../../shared/models';
import { ItemAudioComponent } from '../../../item-details/item-audio/item-audio.component';

@Component({
    selector: 'app-add-language',
    templateUrl: './add-language.component.html',
    styleUrls: ['./add-language.component.scss']
})
export class AddLanguageComponent implements OnInit, OnDestroy {

    venueId: string;
    itemId: string;

    form: FormGroup;
    languages: string[];
    selectedLanguage: string;
    isLanguageSelected: boolean = false
    description: string = '';
    audioUrl: string = '';
    unsaved: boolean = false;
    item: Item;
    mainPage: string = 'secondaryPage';
    audioAutoplay: boolean = false;
    editmode: boolean = false;
    itemByLanguage: ItemByLanguage

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private languageService: LanguageService,
        private dialog: MatDialog,
        private venuesService: VenuesService) { }

    ngOnInit(): void {
        console.log(this.selectedLanguage)
        this.initForm()
        this.languages = this.languageService.getLanguages()
        this.route.params.subscribe((params: any) => {
            this.venueId = params.venueId;
            this.itemId = params.itemId;

            this.venuesService.getItem(this.venueId, this.itemId).subscribe((item: Item) => {
                this.item = item;
            })
        })
        this.venuesService.itemByLanguage$.subscribe((itemByLanguage: ItemByLanguage) => {
            if (itemByLanguage) {
                this.itemByLanguage = itemByLanguage;
                console.log(this.itemByLanguage);
                this.editmode = true;
                this.isLanguageSelected = true;
                this.form.patchValue({
                    language: this.itemByLanguage.language,
                    name: this.itemByLanguage.itemLS.name,
                    audioAutoplay: this.itemByLanguage.itemLS.audioAutoplay
                })
                this.description = this.itemByLanguage.itemLS.description;
                this.audioUrl = this.itemByLanguage.itemLS.audioUrl
            }
        })
    }

    initForm() {
        this.form = this.fb.group({
            language: new FormControl('', [Validators.required]),
            name: new FormControl('', [Validators.required]),
            audioAutoplay: new FormControl('', [Validators.required])
        })
    }

    onLanguageSelectionChange(e) {
        this.selectedLanguage = e.value;
        this.isLanguageSelected = true
    }
    onDescription() {
        const dialogRef = this.dialog.open(DescriptionComponent, { data: { description: this.description } })
        dialogRef.afterClosed().subscribe((description: string) => {
            this.unsaved = true;
            this.description = description
        })
    }
    onAudio() {
        const dialogRef = this.dialog.open(ItemAudioComponent,
            {
                data:
                {
                    venueId: this.venueId,
                    itemId: this.itemId,
                    language: this.form.value.language
                }
            })
        dialogRef.afterClosed().subscribe((audioUrl: string) => {
            this.audioUrl = audioUrl;
            this.unsaved = true;
        })
    }
    onSubmit() {
        const newItemLS: ItemLS = {
            audioUrl: this.audioUrl,
            audioAutoplay: this.form.value.audioAutoplay,
            description: this.description,
            name: this.form.value.name
        }
        const newItemByLanguage: ItemByLanguage = {
            language: this.form.value.language,
            itemLS: newItemLS,
        }
        // ADDING FIRST LANGUAGE
        if (!this.item.itemsByLanguage) {
            this.item.itemsByLanguage = [];
        }
        if (!this.editmode) {
            // ADDING NEW LANGUAGE
            this.item.itemsByLanguage.push(newItemByLanguage)
        } else {
            // EDITING EXISTING LANGUAGE
            const itemByLanguageIndex = this.item.itemsByLanguage.findIndex((itemByLanguage: ItemByLanguage) => {
                return itemByLanguage.language === this.form.value.language
            })
            console.log(itemByLanguageIndex)
            this.item.itemsByLanguage[itemByLanguageIndex] = newItemByLanguage;
        }

        this.venuesService.updateItem(this.venueId, this.itemId, this.item)
            .then(res => {
                console.log('venue updated')
                this.form.reset();
                this.audioAutoplay = false;
                this.description = null;
                this.audioUrl = null;
                this.unsaved = false;
                this.router.navigate(['/admin/languages', { venueId: this.venueId, itemId: this.itemId }])
            })
            .catch(err => console.log(err));

    }
    onLanguages() {
        this.router.navigate(['/admin/languages', { venueId: this.venueId }])
    }
    onItems() {
        this.router.navigate(['/admin/items', { venueId: this.venueId }])
    }
    onVenues() {
        this.router.navigateByUrl('/admin/venues')
    }
    ngOnDestroy(): void {
        console.log('on destroy');
        this.editmode = false;
        this.venuesService.editItemByLanguage(null);
    }
}
