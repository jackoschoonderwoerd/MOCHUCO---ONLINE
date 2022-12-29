import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../shared/language.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ScannerService } from '../../pages/scanner/scanner.service';
import { SelectLanguageComponent } from './select-language/select-language.component';
import { SelectLanguageService } from './select-language/select-language.service';
import { UiService } from '../../shared/ui.service';
import { ItemService } from '../../pages/item/item.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {


    languages: string[];
    translatedLanguages: string[];

    constructor(
        private dialog: MatDialog,
        private languageService: LanguageService,
        private router: Router,
        private selectLanguageService: SelectLanguageService,
        public scannerService: ScannerService,
        public uiService: UiService,
        private itemService: ItemService,
    ) { }

    ngOnInit(): void {
        this.selectLanguageService.setLanguage('2lYEBd3kQ1EFZMb0JdDU')
        this.languages = this.languageService.getLanguages();
    }
    onScanner() {
        this.router.navigateByUrl('scanner')
    }

    onLanguageSelector() {
        const dialogRef = this.dialog.open(SelectLanguageComponent)
    }
    onScan() {

        const venueId = 'tFCnVjWeMRTLFjhONWJw'
        const itemId = 'CImvrS0TXJXJ9kQohnot'
        // const itemId = 'VQTrQBDIHCV4q3mqlXh6'
        this.router.navigate(['item'], { queryParams: { venueId: venueId, itemId: itemId } });
        // this.itemService.addVisit(venueId, itemId)
        //     .then((data: any) => {
        //         console.log(data)
        //     })
        //     .catch(err => console.error(err));
    }
}
// tFCnVjWeMRTLFjhONWJw
// http://localhost:4200/item?venueId=tFCnVjWeMRTLFjhONWJw&itemId=IfYdgKoKOBgEBsnHkkqr

// http://localhost:4200/item?venueId=vi6JymBHV55wRCYPpakw&itemId=IPcMetm2yRAelA4DMnOv
