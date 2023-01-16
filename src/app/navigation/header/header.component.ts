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
    isNavOpen: boolean = false;

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
        // this.afAuth.currentUser.email
        const subscription = this.generalStore.activeVenue$.subscribe((venue: Venue) => {
            if (venue) {
                // console.log(venue);
                this.venue = venue

                subscription.unsubscribe();
                return;
            }
            // console.log('no venue selected')
        })


        // this.itemService.mainPage$.subscribe((mainPage: Item) => {
        //     console.log(mainPage)
        //     if (mainPage) {
        //         this.languageService.language$.subscribe((language: String) => {

        //             const itemsByLanguage: ItemByLanguage[] = mainPage.itemsByLanguage.filter((itemByLanguage: ItemByLanguage) => {
        //                 return itemByLanguage.language === language
        //             })
        //             console.log(itemsByLanguage[0])
        //             console.log(itemsByLanguage[0].itemLS.name);
        //             this.mainPageName = itemsByLanguage[0].itemLS.name
        //         })
        //     }
        // })
    }

    onLogo() {
        this.dialog.open(MochucoComponent, {
            maxHeight: '80vh'
        })
    }
    onVenueLogo() {
        if (!this.mainPageOpen) {

            this.languageService.language$.subscribe((language: string) => {
                // console.log(language);

                this.itemService.getMainPageItem(this.venue.id).subscribe((mainPageArray: Item[]) => {
                    // console.log(mainPageArray[0]);
                    const mainPage: Item = mainPageArray[0]
                    const itemByLanguageArray: ItemByLanguage[] = mainPage.itemsByLanguage.filter((itemByLanguage: ItemByLanguage) => {
                        return itemByLanguage.language = language
                    })
                    this.mainPageByLanguage = itemByLanguageArray[0];
                    // console.log(this.mainPageByLanguage);

                })
            })
            this.openNav();
            this.mainPageOpen = true;
            this.getSortedItems();
        } else {
            this.onCloseNav()
            this.mainPageOpen = false;
        }
        // this.dialog.open(MainPageComponent, {
        //     panelClass: 'fullscreen-dialog',
        //     height: '100vh',
        //     width: '100vw',
        //     data: {
        //         venueId: this.venue.id
        //     }
        // })

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
    openNav() {
        document.getElementById("mainPageSidenav").style.width = "100vw";
        this.isNavOpen = true

    }
    onCloseNav() {
        document.getElementById("mainPageSidenav").style.width = "0";
        this.isNavOpen = false
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
