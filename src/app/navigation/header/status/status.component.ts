import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeneralStoreService } from '../../../shared/general-store.service';
import { Item, Venue } from 'src/app/shared/models';
import { Router } from '@angular/router';

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

    venue: Venue;
    item: Item;
    language: string

    constructor(
        public generalStore: GeneralStoreService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.generalStore.activeVenue$.subscribe((venue: Venue) => {
            this.venue = venue;
        })
        this.generalStore.activeItem$.subscribe((item: Item) => {
            if (item) {
                this.item = item;
                console.log(item);
                return;
            }
            console.log('no item selected')
        })
        this.generalStore.activeLanguage$.subscribe((language: string) => {
            if (language) {
                console.log(language);
                this.language = language;
                return;
            }
            console.log('no language selected')
        })
    }

    onManual() {
        this.router.navigate(['/admin']);
        this.generalStore.activeLanguage$.subscribe((language: string) => {
            console.log(language)
        })
    }

    onAllVenues() {
        this.router.navigate(['admin/venues']);
        this.generalStore.setActiveVenue(null);
        this.generalStore.setActiveItem(null, null);
        this.generalStore.setActiveLanguage(null);
        this.generalStore.setAction('overview venues')
    }
    onVenue() {
        console.log(this.venue.id)
        this.router.navigate(['admin/items', { venueId: this.venue.id }])
        this.generalStore.setActiveItem(null, null);
        this.generalStore.setActiveLanguage(null);
        this.generalStore.setAction('overview venue')
    }
    onItem() {
        console.log(this.item.id)
        this.generalStore.setAction('overview languages')
        this.router.navigate(
            ['admin/languages', {
                venueId: this.venue.id,
                itemId: this.item.id,
                itemName: this.item.name
            }],)
        // this.router.navigate(['/admin/languages'], {
        //     queryParams: {
        //         venueId: this.venue.id,
        //         itemId: this.item.id,
        //         itemName: this.item.name
        //     }
        // })



        this.generalStore.setActiveLanguage(null);
    }
    onLanguage() {
        this.generalStore.setAction('language sp')
        this.router.navigate(['/admin/add-language', {
            venueId: this.venue.id,
            itemId: this.item.id,
            itemName: this.item.name
        }])
    }


}
