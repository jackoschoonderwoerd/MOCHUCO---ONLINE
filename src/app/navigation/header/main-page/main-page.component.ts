import { Component, OnInit, Inject } from '@angular/core';
import { Item, ItemByLanguage, ItemLocation, Venue } from 'src/app/shared/models';
import { VenuesService } from '../../../admin/venues/venues.service';
import { ItemService } from '../../../pages/item/item.service';
import { Observable } from 'rxjs';
import { LanguageService } from '../../../shared/language.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MapComponent } from './map/map.component';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

    item: Item;
    name: string;
    imageUrl: string;
    description: string;
    audioUrl: string;
    language$: Observable<string>
    itemIdsAndDistances: any[];
    locationRef: string

    constructor(
        private venuesService: VenuesService,
        private itemService: ItemService,
        private languageService: LanguageService,
        private dialogRef: MatDialogRef<MainPageComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private router: Router,
        private dialog: MatDialog

    ) { }

    ngOnInit(): void {

        this.languageService.language$.subscribe((language: string) => {
            this.venuesService.activeVenue$.subscribe((venue: Venue) => {
                console.log(venue)
                this.itemService.getMainPageItem(venue.id).subscribe((itemArray: Item[]) => {
                    console.log(itemArray)
                    const item: Item = itemArray[0]
                    this.item = item
                    this.name = item.name;
                    this.imageUrl = item.imageUrl;
                    console.log(language);
                    const itemsByLanguageArray = item.itemsByLanguage.filter((itemByLanguage: ItemByLanguage) => {
                        return itemByLanguage.language === language
                    })
                    console.log(itemsByLanguageArray);
                    if (itemsByLanguageArray.length > 0) {
                        const itemByLanguage: ItemByLanguage = itemsByLanguageArray[0]
                        console.log(itemByLanguage)
                        this.description = itemByLanguage.itemLS.description;
                        this.audioUrl = itemByLanguage.itemLS.audioUrl;
                    } else {
                        this.description = 'Description not available in selected language'
                    }


                })
            })
        })
        this.getSortedItems()
    }

    onInfo(itemId: string) {
        this.dialogRef.close()
        this.router.navigate(['item'], { queryParams: { venueId: this.data.venueId, itemId: itemId } });
    }
    onLocation(latitude: number, longitude: number) {
        console.log(latitude, longitude)
        this.dialog.open(MapComponent, { data: { latitude, longitude } })
    }
    getLocationRef(latitude: number, longitude: number) {

        return `https://maps.google.com/?q=${latitude},${longitude}`

    }

    getSortedItems() {
        if (!navigator) {
            return;
        }

        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
            console.log('navigator present')
            const visitorLat = position.coords.latitude;
            const visitorLon = position.coords.longitude;
            const distanceVisitorToItems = [];
            this.itemService.getLocations(this.data.venueId).subscribe((itemLocations: ItemLocation[]) => {
                let itemIdsAndDistances = []
                itemLocations.forEach((itemLocation: any) => {
                    const distance = Math.round(this.distanceFromObject(
                        visitorLat,
                        visitorLon,
                        itemLocation.latitude,
                        itemLocation.longitude
                    ))
                    console.log(distance);
                    itemIdsAndDistances.push(
                        {
                            id: itemLocation.id,
                            latitude: itemLocation.latitude,
                            longitude: itemLocation.longitude,
                            name: itemLocation.itemName,
                            distance: distance
                        }
                    )
                    itemIdsAndDistances = itemIdsAndDistances.sort((a, b) => {
                        return a.distance - b.distance
                    })
                    console.log(itemIdsAndDistances)
                })
                this.itemIdsAndDistances = itemIdsAndDistances
                // console.log(itemIdsAndDistances)
            })
        })
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
        console.log(Math.round(d * 1000) + 'meter')
        return d * 1000; // meters
    }

    onCloseWindow() {
        this.dialogRef.close();
    }
}
// https://maps.google.com/?q=51.6034285,4.7430461
