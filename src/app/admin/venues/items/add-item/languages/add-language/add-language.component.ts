import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LanguageService } from 'src/app/shared/language.service';
import { MatDialog } from '@angular/material/dialog';
import { DescriptionComponent } from './description/description.component';
import { VenuesService } from '../../../../venues.service';
import { Item, ItemByLanguage, ItemLS } from '../../../../../../shared/models';
import { LanguageAudioComponent } from './language-audio/language-audio.component';
import { ItemsService } from '../../../items.service';
import { WarningComponent } from '../../../../../../shared/warning/warning.component';
import { ConfirmDeleteComponent } from '../../../../../../shared/confirm-delete/confirm-delete.component';
import { UiService } from '../../../../../../shared/ui.service';
import { AuthService } from 'src/app/admin/auth/auth.service';
import { GeneralStoreService } from '../../../../../../shared/general-store.service';

@Component({
    selector: 'app-add-language',
    templateUrl: './add-language.component.html',
    styleUrls: ['./add-language.component.scss']
})
export class AddLanguageComponent implements OnInit, OnDestroy {

    audioAutoplay: boolean = false;
    audioUrl: string = '';
    description: string = '';
    editmode: boolean = false;
    form: FormGroup;
    isLanguageSelected: boolean = false
    item: Item;
    itemByLanguage: ItemByLanguage;
    itemId: string;
    languages: string[];
    mainPage: string = 'secondaryPage';
    selectedLanguage: string;
    unsaved: boolean = false;
    venueId: string;


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private languageService: LanguageService,
        private dialog: MatDialog,
        public venuesService: VenuesService,
        public itemsService: ItemsService,
        public authService: AuthService,
        public generalStore: GeneralStoreService
    ) { }

    ngOnInit(): void {
        this.initForm()
        // this.languages = this.languageService.getLanguages()
        if (this.route.snapshot.paramMap.get('availableLanguages')) {
            this.languages = this.route.snapshot.paramMap.get('availableLanguages').split(',')
        }

        this.route.params.subscribe((params: any) => {
            this.venueId = params.venueId;
            this.itemId = params.itemId;

            this.itemsService.getItem(this.venueId, this.itemId).subscribe((item: Item) => {
                this.item = item;
            })
        })
        this.itemsService.itemByLanguage$.subscribe((itemByLanguage: ItemByLanguage) => {
            if (itemByLanguage) {
                console.log(itemByLanguage)
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
            } else {
                console.log('no itembylanguage')
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
        this.isLanguageSelected = true;
        this.unsaved = true;
        this.generalStore.setActiveLanguage(e.value);
    }
    onDescription() {
        const dialogRef = this.dialog.open(DescriptionComponent, {
            panelClass: 'full-screen-modal',
            width: '100vw',
            // height: '100vh',
            data:
            {
                description: this.description,
            }
        })
        dialogRef.afterClosed().subscribe((description: string) => {
            this.unsaved = true;
            this.description = description
        })
    }
    onAudio() {
        const dialogRef = this.dialog.open(LanguageAudioComponent,
            {
                data:
                {
                    venueId: this.venueId,
                    itemId: this.itemId,
                    language: this.form.value.language,
                    audioUrl: this.audioUrl
                }
            })
        dialogRef.afterClosed().subscribe((audioDialogData: any) => {
            if (audioDialogData) {
                if (audioDialogData.action === 'audio added') {
                    this.audioUrl = audioDialogData.audioUrl;
                    this.unsaved = true;
                } else if (audioDialogData.action === 'audio removed') {
                    this.audioUrl = null
                }
                return;
            }
            return;
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
            this.generalStore.setActiveLanguage(null)
            this.generalStore.setAction('overview langages')
        } else {
            // EDITING EXISTING LANGUAGE
            const itemByLanguageIndex = this.item.itemsByLanguage.findIndex((itemByLanguage: ItemByLanguage) => {
                return itemByLanguage.language === this.form.value.language
            })
            console.log(itemByLanguageIndex)
            this.item.itemsByLanguage[itemByLanguageIndex] = newItemByLanguage;
        }

        this.itemsService.setItem(this.venueId, this.itemId, this.item)
            .then(res => {
                console.log('venue updated')
                this.form.reset();
                this.audioAutoplay = false;
                this.description = null;
                this.audioUrl = null;
                this.unsaved = false;
                this.router.navigate(['/admin/languages', { venueId: this.venueId, itemId: this.itemId }])
                this.generalStore.setActiveLanguage(null)
                this.generalStore.setAction('overview langages')
            })
            .catch(err => console.log(err));

    }
    onLanguages() {
        this.router.navigate(['/admin/languages', { venueId: this.venueId, itemId: this.itemId }])
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
        this.itemsService.editItemByLanguage(null);
    }
    onFormChanged() {
        this.unsaved = true;
    }
    onCancel() {
        if (!this.unsaved) {
            window.history.back();
            this.generalStore.setAction('overview languages');
            this.generalStore.setActiveLanguage(null);
        } else {
            const dialogRef = this.dialog.open(ConfirmDeleteComponent,
                {
                    data:
                        { message: 'all your edits will be lost' }
                })
            dialogRef.afterClosed().subscribe((res) => {
                if (res) {
                    window.history.back();
                    this.generalStore.setActiveLanguage(null);
                    this.generalStore.setAction('overview languages')
                }
                return;
            })
        }
    }
}
