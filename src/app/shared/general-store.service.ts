import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Venue, Item, ItemByLanguage } from './models';
import { VenuesService } from '../admin/venues/venues.service';
import { ItemsService } from '../admin/venues/items/items.service';

@Injectable({
    providedIn: 'root'
})
export class GeneralStoreService {

    private activeVenueSubject = new BehaviorSubject<Venue>(null);
    public activeVenue$ = this.activeVenueSubject.asObservable();

    private activeItemSubject = new BehaviorSubject<Item>(null);
    public activeItem$ = this.activeItemSubject.asObservable();

    private activeLanguageSubject = new BehaviorSubject<string>(null);
    public activeLanguage$ = this.activeLanguageSubject.asObservable();

    private activeItemByLanguageSubject = new BehaviorSubject<ItemByLanguage>(null);
    public activeItemByLanguage$ = this.activeItemByLanguageSubject.asObservable()

    private actionSubject = new BehaviorSubject<string>(null);
    public action$ = this.actionSubject.asObservable();

    constructor(
        private venuesService: VenuesService,
        private itemsService: ItemsService
    ) { }

    setActiveVenue(venueId: string) {
        console.log('GS setting active venue');
        this.venuesService.getVenueById(venueId)
            .subscribe((venue: Venue) => {
                this.activeVenueSubject.next(venue);
            })

    }
    setActiveItem(venueId: string, itemId: string) {
        console.log('GS setting active item');
        this.itemsService.getItem(venueId, itemId)
            .subscribe((item: Item) => {
                this.activeItemSubject.next(item);
            })
    }
    setActiveLanguage(language) {
        console.log(language);
        this.activeLanguageSubject.next(language);
    }
    setActiveItemByLanguage(itemByLanguage: ItemByLanguage) {
        if (itemByLanguage) {
            console.log(itemByLanguage)
            this.activeItemByLanguageSubject.next(itemByLanguage)
            return;
        }
        console.log('no itemByLanguage selected')
    }
    setAction(action: string) {
        this.actionSubject.next(action);
    }
    setAllToNull() {
        console.log('setting to null');
        this.setActiveVenue(null);
        this.setActiveItem(null, null);
        this.setActiveLanguage(null);
        this.setActiveItemByLanguage(null);
        this.setAction(null);
        // this.activeVenueSubject.next(null);
        // this.activeItemSubject.next(null);
        // this.activeLanguageSubject.next(null);
        // this.activeItemByLanguageSubject.next(null);
        // this.actionSubject.next(null);
    }
}
