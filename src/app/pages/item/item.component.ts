import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item, ItemLocation } from 'src/app/shared/models';
import { ItemService } from './item.service';
import { from, Observable, of } from 'rxjs';
import { LanguageService } from 'src/app/shared/language.service';
import { ItemByLanguage, Venue } from '../../shared/models';
import { ItemsService } from '../../admin/venues/items/items.service';
import { UiService } from '../../shared/ui.service';
import { VenuesService } from '../../admin/venues/venues.service';
import { GeneralStoreService } from 'src/app/shared/general-store.service';



@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

    item: Item
    item$: Observable<Item>
    title: string = 'items'
    language$: Observable<string>

    imageUrl: string;
    itemName: string;
    description: string;
    audioUrl: string;
    audioAutoplay: boolean;
    venueId: string;
    itemId: string;
    isLiked: boolean = false

    isAudioPanelOpen: boolean = false;

    @Output() audioUrlChanged: EventEmitter<string> = new EventEmitter()


    constructor(
        private route: ActivatedRoute,
        public languageService: LanguageService,
        public itemService: ItemService,
        public uiService: UiService,
        private venuesService: VenuesService,
        private generalStore: GeneralStoreService) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe((queryParams: any) => {
            console.log(queryParams);
            this.venueId = queryParams.venueId;
            this.generalStore.setActiveVenue(this.venueId);
            this.itemService.getMainPageItem(this.venueId)
            // this.venuesService.getVenueById(this.venueId).subscribe((venue: Venue) => {

            // })
            this.itemId = queryParams.itemId
            this.languageService.language$.subscribe((language: string) => {

                console.log(language)
                if (!this.venueId) {
                    console.log('no venueId go home!')
                } else if (this.venueId && !this.itemId) {
                    console.log(this.venueId, 'no itemId', 'get id of nearest item, show nearest item')
                    this.getItemIdNearestItem(this.venueId, language)
                } else if (this.venueId && this.itemId) {
                    this.getItem(this.venueId, this.itemId, language)
                }

            })
        })
    }

    audioPanelOpen(status: boolean) {
        // console.log(status);
        this.isAudioPanelOpen = status;
    }

    getAvailableLanguages(item: Item) {
        console.log(item);
        const languages: string[] = [];
        item.itemsByLanguage.forEach((itemByLanguage: ItemByLanguage) => {
            languages.push(itemByLanguage.language)
            this.languageService.setAvailableLanguages(languages)
        })
    }

    getItemIdNearestItem(venueId: string, language: string) {
        if (!navigator) {
            return;
        }
        this.uiService.setIsSearchingNearestItem(true)
        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
            console.log('navigator present')
            const visitorLat = position.coords.latitude;
            const visitorLon = position.coords.longitude;
            const distanceVisitorToItems = []
            this.itemService.getLocations(this.venueId).subscribe((itemLocations: ItemLocation[]) => {
                let itemIdsAndDistances = []
                itemLocations.forEach((itemLocation: ItemLocation) => {
                    const distance = Math.round(this.distanceFromObject(
                        visitorLat,
                        visitorLon,
                        itemLocation.latitude,
                        itemLocation.longitude
                    ))
                    itemIdsAndDistances.push(
                        {
                            id: itemLocation.id,
                            distance: distance
                        }
                    )
                    itemIdsAndDistances = itemIdsAndDistances.sort((a, b) => {
                        return a.distance - b.distance
                    })
                    console.log(itemIdsAndDistances)
                    this.uiService.setIsSearchingNearestItem(false);
                    this.getItem(venueId, itemIdsAndDistances[0].id, language)
                })
            })
        })
    }


    getItem(venueId: string, itemId: string, language: string) {
        this.uiService.setIsFetchingItemData(true)
        console.log(venueId, itemId, language)
        this.itemService.getItem(venueId, itemId).subscribe((item: Item) => {
            console.log(item);
            this.getAvailableLanguages(item)
            this.uiService.setIsFetchingItemData(false)
            this.imageUrl = item.imageUrl;
            this.itemService.addVisit(venueId, itemId)
                .then((docRef: any) => {
                    this.itemService.setActiveVisitId(docRef.id)
                })
                .catch(err => console.error(err));
            const itemByLanguageArray: ItemByLanguage[] = item.itemsByLanguage.filter((itemByLanguage: ItemByLanguage) => {
                return itemByLanguage.language === language
            })
            console.log(itemByLanguageArray)
            if (itemByLanguageArray.length > 0) {
                const itemByLanguage: ItemByLanguage = itemByLanguageArray[0]

                this.itemName = itemByLanguage.itemLS.name;
                this.description = itemByLanguage.itemLS.description;
                this.audioUrl = itemByLanguage.itemLS.audioUrl;
                this.audioAutoplay = itemByLanguage.itemLS.audioAutoplay;

                this.itemService.updateAudioUrl(this.audioUrl);
            }
        })
    }
    onLike() {
        this.isLiked = true;
        this.itemService.like(this.venueId, this.itemId)

    }

    distanceFromObject(latObject: number, lonObject: number, latVisitor: number, lonVisitor: number) {  // generally used geo measurement function
        var R = 6378.137; // Radius of earth in KM
        var dLat = latVisitor * Math.PI / 180 - latObject * Math.PI / 180;
        var dLon = lonVisitor * Math.PI / 180 - lonObject * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latObject * Math.PI / 180) * Math.cos(latVisitor * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        // console.log(Math.round(d * 1000) + 'meter')
        return d * 1000; // meters
    }

}
