import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item, ItemByLanguage, Venue } from '../../../../../shared/models';
import { VenuesService } from '../../../venues.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../../../../../shared/confirm-delete/confirm-delete.component';
import { Observable } from 'rxjs';
import { LanguageService } from 'src/app/shared/language.service';

@Component({
    selector: 'app-languages',
    templateUrl: './languages.component.html',
    styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

    venue$: Observable<Venue>;
    activeItem$: Observable<Item>
    venueId: string;
    itemId: string;
    item: Item;
    itemName: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private venuesService: VenuesService,
        private dialog: MatDialog,
        private languageService: LanguageService
    ) { }

    ngOnInit(): void {
        this.venue$ = this.venuesService.activeVenue$;
        this.activeItem$ = this.venuesService.activeItem$;

        console.log('onInit')
        this.route.params.subscribe((params: any) => {
            console.log(params);
            this.venueId = params.venueId;
            this.itemId = params.itemId;
            this.itemName = params.itemName;
            const sub = this.venuesService.getItem(this.venueId, this.itemId).subscribe((item: Item) => {
                this.item = item;
                console.log(this.item);
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
                this.venuesService.setItem(this.venueId, this.itemId, this.item)
                    .then((res) => { console.log('item deleted') })
                    .catch(err => console.log(err));
            }
            return;
        })
    }

    onEdit(itemByLanguage: ItemByLanguage) {
        console.log(itemByLanguage)
        this.venuesService.editItemByLanguage(itemByLanguage)
        this.router.navigate(['/admin/add-language', {
            venueId: this.venueId,
            itemId: this.itemId
        }])

    }
    onAddLanguage() {
        this.getAvailableLanguages()
        this.router.navigate(['/admin/add-language', {
            venueId: this.venueId,
            itemId: this.itemId,
            availableLanguages: this.getAvailableLanguages()
            // availableLanguages: this.getAvailableLanguages()

        }])
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
