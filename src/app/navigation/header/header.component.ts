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
import { Item, ItemByLanguage, Venue } from '../../shared/models';
import { VenuesService } from '../../admin/venues/venues.service';
import { MainPageComponent } from './main-page/main-page.component';
import { GeneralStoreService } from 'src/app/shared/general-store.service';



@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


    mainPageName: string;
    venue: Venue;



    constructor(
        private router: Router,
        public uiService: UiService,
        private dialog: MatDialog,
        public authService: AuthService,
        public itemService: ItemService,
        public languageService: LanguageService,
        public venuesService: VenuesService,
        public generalStore: GeneralStoreService


    ) { }

    ngOnInit(): void {
        this.generalStore.activeVenue$.subscribe((venue: Venue) => {
            if (venue) {
                console.log(venue);
                this.venue = venue
                return;
            }
            console.log('no venue selected')
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
        this.dialog.open(MainPageComponent, {
            panelClass: 'fullscreen-dialog',
            height: '100vh',
            width: '100vw',
            data: {
                venueId: this.venue.id
            }
        })
        // this.venuesService.activeVenue$.subscribe((venue: Venue) => {
        //     console.log(venue)
        //     this.itemService.getMainPageItem(venue.id).subscribe((itemArray: Item[]) => {
        //         console.log(itemArray)
        //         const itemId = itemArray[0].id;
        //         console.log(venue.id, itemId)
        //         this.router.navigate(['item'], { queryParams: { venueId: venue.id, itemId } });
        //     })
        // })
    }
    // onMainPageSelected() {
    //     this.router.navigate(['/item', { mainPage: 'mainPage' }]);
    //     this.itemService.extractMainPage()
    // }
    onLogout() {
        this.generalStore.setAllToNull();
        setTimeout(() => {
            this.authService.logout()
        }, 1000);
    }
}
