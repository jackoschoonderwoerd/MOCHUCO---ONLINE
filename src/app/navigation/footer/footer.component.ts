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
    ) { }

    ngOnInit(): void {
        this.selectLanguageService.setLanguage('2lYEBd3kQ1EFZMb0JdDU')
        this.languages = this.languageService.getLanguages();
    }
    onScanner() {
        this.router.navigateByUrl('scanner')
    }
    onLanguageSelector() {
        this.dialog.open(SelectLanguageComponent)
    }
}
