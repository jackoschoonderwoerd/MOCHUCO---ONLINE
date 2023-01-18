import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { ScannerService } from '../../pages/scanner/scanner.service';
import { UiService } from '../../shared/ui.service';
import { MatDialog } from '@angular/material/dialog';

import { MochucoComponent } from '../../pages/mochuco/mochuco.component';
import { AuthService } from '../../admin/auth/auth.service';
import { ItemService } from '../../pages/item/item.service';
import { LanguageService } from '../../shared/language.service';
import { Item, ItemByLanguage, Venue, ItemLocation } from '../../shared/models';
import { VenuesService } from '../../admin/venues/venues.service';
import { MainPageComponent } from './main-page/main-page.component';
import { GeneralStoreService } from 'src/app/shared/general-store.service';
import { Auth } from '@angular/fire/auth';
import { WarningComponent } from 'src/app/shared/warning/warning.component';




@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


    mainPageName: string;
    venue: Venue;
    public mainPage: Item;
    language: string
    language$: Observable<string>
    mainPageByLanguage: ItemByLanguage;
    mainPageOpen: boolean = false;
    itemIdsAndDistances: any[];
    mainPageDescription: Observable<string>;
    // isNavOpen: boolean = false;

    constructor(
        private router: Router,
        public uiService: UiService,
        private dialog: MatDialog,
        public authService: AuthService,
        public itemService: ItemService,
        public languageService: LanguageService,
        public venuesService: VenuesService,
        public generalStore: GeneralStoreService,
        public afAuth: Auth



    ) { }

    ngOnInit(): void {
        this.generalStore.activeVenue$.subscribe((venue: Venue) => {
            console.log(venue)
            this.venue = venue;
        })
    }


    onVenueLogo() {
        console.log('this.onVenueLogo()')
        // console.log(mainPageByLanguage)
        if (!this.mainPageOpen) {

            // this.mainPageOpen = true;
            const language = this.languageService.getLanguage();
            console.log(language);
            this.itemService.getMainPageItem(this.venue.id).subscribe((items: Item[]) => {
                const mainPageByLanguages = items[0].itemsByLanguage.filter((itemByLanguage: ItemByLanguage) => {
                    console.log(itemByLanguage)
                    return itemByLanguage.language === language
                })
                if (mainPageByLanguages.length > 0) {
                    this.mainPageByLanguage = mainPageByLanguages[0];
                    this.openMainPageSide();
                } else {
                    this.mainPageByLanguage = {
                        language: '',
                        itemLS: {
                            name: '',
                            description: 'This page in not available in the selected language.'
                        }
                    }
                    this.openMainPageSide();
                    // this.dialog.open(WarningComponent, { data: { message: 'not available in selected language' } })
                    // console.log('not available in selected language');
                }
                this.getSortedItems();
            })
            // this.languageService.language$.subscribe((language: string) => {
            //     console.log(language);

            // this.itemService.getMainPageItem(this.venue.id).subscribe((mainPageArray: Item[]) => {
            //     console.log(mainPageArray);
            //     if (mainPageArray.length > 0) {
            //         mainPageArray.forEach((mainPage: Item) => {
            //             console.log(mainPage)
            //         })
            //         const mainPage: Item = mainPageArray[0]
            //         const theLanguage = this.languageService.getLanguage()
            //         console.log(theLanguage)
            //         const itemByLanguageArray: ItemByLanguage[] = mainPage.itemsByLanguage.filter((itemByLanguage: ItemByLanguage) => {
            //             return itemByLanguage.language = 'english'
            //         })
            //         this.mainPageByLanguage = itemByLanguageArray[0];
            //         console.log(this.mainPageByLanguage.itemLS.description)
            //         this.getSortedItems();
            //     } else {
            //         console.log('no mainpage available')
            //         this.mainPageByLanguage = null;
            //     }
            // })
            // })
            this.mainPageOpen = true;
        } else {
            this.onCloseNav()
            this.mainPageOpen = false;
        }
    }

    onMochucoLogo() {
        this.onCloseNav();
        this.router.navigateByUrl('/mochuco');
    }

    onLogout() {
        this.generalStore.setAllToNull();
        setTimeout(() => {
            this.authService.logout()
        }, 1000);
    }
    openMainPageSide() {
        console.log('this.openMainPageSide()')
        document.getElementById("mainPageSidenav").style.width = "100vw";
        this.mainPageOpen = true

    }
    onCloseNav() {
        document.getElementById("mainPageSidenav").style.width = "0";
        this.mainPageOpen = false;
        this.mainPageOpen = false;

    }
    onItem(itemId: string) {
        // console.log(itemId)
        this.onCloseNav();
        this.router.navigate(['item'], { queryParams: { venueId: this.venue.id, itemId: itemId } });
    }
    getSortedItems() {
        if (!navigator) {
            return;
        }

        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
            // console.log('navigator present')
            const visitorLat = position.coords.latitude;
            const visitorLon = position.coords.longitude;
            const distanceVisitorToItems = [];
            this.itemService.getLocations(this.venue.id).subscribe((itemLocations: ItemLocation[]) => {
                let itemIdsAndDistances = []
                itemLocations.forEach((itemLocation: any) => {
                    const distance = Math.round(this.distanceFromObject(
                        visitorLat,
                        visitorLon,
                        itemLocation.latitude,
                        itemLocation.longitude
                    ))
                    // console.log(distance);
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
                    // console.log(itemIdsAndDistances)
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
        // console.log(Math.round(d * 1000) + 'meter')
        return d * 1000; // meters
    }
}
