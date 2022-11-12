import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { ScannerService } from '../../pages/scanner/scanner.service';
import { UiService } from '../../shared/ui.service';
import { MatDialog } from '@angular/material/dialog';

import { MochucoComponent } from '../../pages/mochuco/mochuco.component';
import { AuthService } from '../../admin/auth/auth.service';
import { ItemService } from '../../pages/item/item.service';
import { LanguageService } from '../../shared/language.service';
import { Item, ItemByLanguage } from '../../shared/models';



@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


    mainPageName: string



    constructor(
        private router: Router,
        public uiService: UiService,
        private dialog: MatDialog,
        public authService: AuthService,
        public itemService: ItemService,
        public languageService: LanguageService,


    ) { }

    ngOnInit(): void {
        this.itemService.mainPage$.subscribe((mainPage: Item) => {
            console.log(mainPage)
            if (mainPage) {
                this.languageService.language$.subscribe((language: String) => {

                    const itemsByLanguage: ItemByLanguage[] = mainPage.itemsByLanguage.filter((itemByLanguage: ItemByLanguage) => {
                        return itemByLanguage.language === language
                    })
                    console.log(itemsByLanguage[0])
                    console.log(itemsByLanguage[0].itemLS.name);
                    this.mainPageName = itemsByLanguage[0].itemLS.name
                })
            }
        })
    }

    onLogo() {
        this.dialog.open(MochucoComponent, {
            maxHeight: '80vh'
        })
    }
    onMainPageSelected() {

        this.router.navigate(['/item', { mainPage: 'mainPage' }]);
        this.itemService.extractMainPage()
    }
}
