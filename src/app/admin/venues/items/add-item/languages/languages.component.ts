import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item, ItemByLanguage, Venue } from '../../../../../shared/models';
import { VenuesService } from '../../../venues.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../../../../../shared/confirm-delete/confirm-delete.component';
import { Observable } from 'rxjs';
import { LanguageService } from 'src/app/shared/language.service';
import { ItemsService } from '../../items.service';
import { WarningComponent } from 'src/app/shared/warning/warning.component';
import { GeneralStoreService } from 'src/app/shared/general-store.service';

@Component({
    selector: 'app-languages',
    templateUrl: './languages.component.html',
    styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

    venue$: Observable<Venue>;
    // activeItem$: Observable<Item>
    venueId: string;
    itemId: string;
    item: Item;
    itemName: string;
    isLoadingData: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private venuesService: VenuesService,
        private dialog: MatDialog,
        private languageService: LanguageService,
        private itemsService: ItemsService,
        public generalStore: GeneralStoreService
    ) { }

    ngOnInit(): void {
        this.venue$ = this.generalStore.activeVenue$;
        // this.activeItem$ = this.itemsService.activeItem$;

        console.log('onInit')
        this.route.params.subscribe((params: any) => {
            this.isLoadingData = true;
            console.log(params);
            this.venueId = params.venueId;
            this.itemId = params.itemId;
            this.itemName = params.itemName;
            const sub = this.itemsService.getItem(this.venueId, this.itemId).subscribe((item: Item) => {
                if (item.itemsByLanguage && item.itemsByLanguage.length > 0) {
                    item.itemsByLanguage.sort((a, b) => {
                        if (a.language < b.language) {
                            return -1
                        }
                        if (a.language > b.language) {
                            return 1
                        }
                        return 0
                    })
                }
                this.item = item;
                // console.log(this.item);
                this.isLoadingData = false;
                sub.unsubscribe();
            })
        })
    }
    onDelete(language) {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, { data: { message: 'this will permanently delete this item' } })
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.item.itemsByLanguage = this.item.itemsByLanguage.filter((itemByLanguage: ItemByLanguage) => {
                    return itemByLanguage.language !== language
                })
                this.itemsService.setItem(this.venueId, this.itemId, this.item)
                    .then((res) => { console.log('item deleted') })
                    .catch(err => console.log(err));
            }
            return;
        })
    }

    onEdit(itemByLanguage: ItemByLanguage) {
        console.log(itemByLanguage)
        this.generalStore.setActiveLanguage(itemByLanguage.language);
        this.itemsService.editItemByLanguage(itemByLanguage);
        this.itemsService.setItemByLanguage(itemByLanguage);
        this.generalStore.setAction('editing language')
        this.router.navigate(['/admin/add-language', {
            venueId: this.venueId,
            itemId: this.itemId
        }])

    }
    onAddLanguage() {
        if (this.getAvailableLanguages().length === 0) {
            this.dialog.open(WarningComponent, { data: { message: 'No more languages available' } })
            return
        }
        this.router.navigate(['/admin/add-language', {
            venueId: this.venueId,
            itemId: this.itemId,
            availableLanguages: this.getAvailableLanguages()
            // availableLanguages: this.getAvailableLanguages()

        }])
        this.generalStore.setAction('adding language');
        this.generalStore.setActiveLanguage('select language');
    }
    onItems() {
        this.getAvailableLanguages()
        this.router.navigate(['/admin/items', {
            venueId: this.venueId
        }])
    }
    getAvailableLanguages() {
        const languages = this.languageService.getLanguages();
        const takenLanguages: string[] = [];
        const availableLanguages: string[] = []
        console.log(this.item)
        if (!this.item.itemsByLanguage) {
            this.item.itemsByLanguage = [];
        }
        console.log(this.item)
        this.item.itemsByLanguage.forEach((itemByLanguage: ItemByLanguage) => {
            takenLanguages.push(itemByLanguage.language);
        })
        languages.forEach((language: string) => {
            if (!takenLanguages.includes(language)) {
                availableLanguages.push(language);
            }
        })
        console.log(availableLanguages)
        return availableLanguages


    }
    onVenues() {
        this.router.navigateByUrl('/admin/venues');
    }

}
