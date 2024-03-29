import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item, ItemLocation } from 'src/app/shared/models';
import { ItemService } from './item.service';
import { from, Observable, of } from 'rxjs';
import { LanguageService } from 'src/app/shared/language.service';
import { ItemByLanguage, Venue } from '../../shared/models';
import { ItemsService } from '../../admin/venues/items/items.service';
import { UiService } from '../../shared/ui.service';
import { VenuesService } from '../../admin/venues/venues.service';
import { GeneralStoreService } from 'src/app/shared/general-store.service';
import { MatDialog } from '@angular/material/dialog';
import { LocationErrorDialogComponent } from './location-error-dialog/location-error-dialog.component';
import { WarningComponent } from '../../shared/warning/warning.component';



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
        private generalStore: GeneralStoreService,
        private dialog: MatDialog,
        private router: Router) { }

    ngOnInit(): void {

        this.route.queryParams.subscribe((queryParams: any) => {
            console.log(queryParams);
            this.venueId = queryParams.venueId;
            this.generalStore.setActiveVenue(this.venueId);
            this.itemService.getMainPageItem(this.venueId);
            // this.venuesService.getVenueById(this.venueId).subscribe((venue: Venue) => {

            // })
            this.itemId = queryParams.itemId;

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
        // this.geoFindMe();
        // this.getUserPosition();
    }

    audioPanelOpen(status: boolean) {
        // console.log(status);
        this.isAudioPanelOpen = status;
    }

    setAvailableLanguages(item) {
        if (!item) {
            console.log('no item')
            return;
        } else {
            console.log(item);
            const languages: string[] = [];
            item.itemsByLanguage.forEach((itemByLanguage: ItemByLanguage) => {
                console.log(itemByLanguage.language);
                languages.push(itemByLanguage.language)
                this.languageService.setAvailableLanguages(languages)
            })
        }
    }


    getItemIdNearestItem(venueId: string, language: string) {
        // alert(`getting nearest item ${venueId}, ${language}`)
        // IPHONE 6 & 8 => SETTINGS => PRIVACY & SECURITY (at the bottom of 'General') => LOCATION SERVICES (first on the list) ON => (allow location access) ON

        // IPHONE 6 & 8 => SETTINGS => PRIVACY & SECURITY (at the bottom of 'General') => LOCATION SERVICES (first on the list) ON => SAFARI WEBSITES => WHILE USING THE APP
        // IPHONE 6 & 8 => SETTINGS => PRIVACY & SECURITY (at the bottom of 'General') => LOCATION SERVICES (first on the list) ON => SAFARI WEBSITES => PRECISE LOCATION

        // IPHONE 6 & 8 => SETTINGS => PRIVACY & SECURITY (at the bottom of 'General') => LOCATION SERVICES (first on the list) ON => CHROME => WHILE USING THE APP
        // IPHONE 6 & 8 => SETTINGS => PRIVACY & SECURITY (at the bottom of 'General') => LOCATION SERVICES (first on the list) ON => CHROME => PRECISE LOCATION
        // alert('IC 90: getItemIdNearestItem: ' + venueId)
        if (!navigator) {
            // alert('No navigator');
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 5000
        };
        // alert('IC 98: navigator found')
        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
            const visitorLat = position.coords.latitude;
            const visitorLon = position.coords.longitude;
            // alert(position.coords.accuracy.toFixed() + ' meters from scanned item')
            // alert('IC 101: ' + visitorLat + ' ' + visitorLon)
            const distanceVisitorToItems = []
            this.itemService.getLocations(this.venueId).subscribe((itemLocations: ItemLocation[]) => {
                let itemIdsAndDistances = []
                itemLocations.forEach((itemLocation: ItemLocation) => {
                    // alert(itemLocation.latitude)
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
                    // console.log(itemIdsAndDistances)
                    this.uiService.setIsSearchingNearestItem(false);
                    this.getItem(venueId, itemIdsAndDistances[0].id, language)
                })
            })
        }, (error: GeolocationPositionError) => {
            if (error) {
                alert('ERROR CODE' + error.code)
                this.router.navigate(['/location-error', { errorCode: error.code }]);
            } else {
                this.dialog.open(LocationErrorDialogComponent, { data: { error: 'no errors' } })
            }
        }, options);
    }

    getItem(venueId: string, itemId: string, language: string) {
        if (venueId && itemId && language) {
            console.log(venueId, itemId, language)

            // alert('IC 129: getting item' + ' ' + venueId + ' ' + itemId + ' ' + language)
            this.uiService.setIsFetchingItemData(true)
            this.itemService.getItem(venueId, itemId).subscribe((item: Item) => {
                if (!item) {
                    // alert('no item found');
                    this.dialog.open(WarningComponent, { data: { message: 'no item found' } });
                    this.router.navigateByUrl('/mochuco')
                    return;
                }
                this.item = item;
                console.log(item);
                this.setAvailableLanguages(item);
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
                    console.log(itemByLanguageArray)
                    const itemByLanguage: ItemByLanguage = itemByLanguageArray[0];
                    this.itemName = itemByLanguage.itemLS.name;
                    this.description = itemByLanguage.itemLS.description;
                    this.audioUrl = itemByLanguage.itemLS.audioUrl;
                    this.audioAutoplay = itemByLanguage.itemLS.audioAutoplay;

                    this.itemService.updateAudioUrl(this.audioUrl);
                } else {
                    console.log(item.itemsByLanguage);
                    const itemByLanguage: ItemByLanguage = item.itemsByLanguage[0];
                    this.itemName = itemByLanguage.itemLS.name;
                    this.description = itemByLanguage.itemLS.description;
                    this.audioUrl = itemByLanguage.itemLS.audioUrl;
                    this.audioAutoplay = itemByLanguage.itemLS.audioAutoplay;

                    this.itemService.updateAudioUrl(this.audioUrl);
                }
            })
        } else {
            alert('insufficient data to get item')
        }
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
        // alert(d);
        // console.log(Math.round(d * 1000) + 'meter')
        return d * 1000; // meters
    }

}
