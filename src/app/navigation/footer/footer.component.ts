import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../shared/language.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ScannerService } from '../../pages/scanner/scanner.service';
import { SelectLanguageComponent } from './select-language/select-language.component';
import { SelectLanguageService } from './select-language/select-language.service';
import { UiService } from '../../shared/ui.service';
import { ItemService } from '../../pages/item/item.service';

export interface TranslatedLanguageObject {
    name: string;
    translation: string;
}

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {



    languages: string[];
    translatedLanguages: string[];
    translatedLanguageObjects: TranslatedLanguageObject[] = [];

    constructor(
        private dialog: MatDialog,
        private languageService: LanguageService,
        private router: Router,
        private selectLanguageService: SelectLanguageService,
        public scannerService: ScannerService,
        public uiService: UiService,
    ) { }

    ngOnInit(): void {
        // this.languageService.setAvailableLanguages(['dutch'])
        // this.selectLanguageService.setLanguage('2lYEBd3kQ1EFZMb0JdDU')
        setTimeout(() => {

            this.languages = this.languageService.getLanguages();
            this.translateLanguages();
        }, 1000);
        console.log(this.languages)
    }
    onScanner() {
        this.router.navigateByUrl('scanner')
    }
    onLanguageSelector() {
        document.getElementById("mySidenav").style.width = "250px";
        // this.dialog.open(SelectLanguageComponent)
    }
    openNav() {
        document.getElementById("mySidenav").style.width = "250px";

    }
    onSelectLanguage(language: string) {
        console.log(language)
        this.languageService.setLanguage(language);
        this.closeNav()
    }
    closeNav() {
        document.getElementById("mySidenav").style.width = "0";
    }
    translateLanguages() {
        this.languages.forEach((language: string) => {
            if (language === 'dutch') {
                this.translatedLanguageObjects.push({
                    name: 'dutch',
                    translation: 'nederlands'
                })
            } else if (language === 'english') {
                this.translatedLanguageObjects.push({
                    name: 'english',
                    translation: 'english'
                })
            } else if (language === 'german') {
                this.translatedLanguageObjects.push({
                    name: 'german',
                    translation: 'deutsch'
                })
            } else if (language === 'french') {
                this.translatedLanguageObjects.push({
                    name: 'french',
                    translation: 'francais'
                })
            } else if (language === 'spanish') {
                this.translatedLanguageObjects.push({
                    name: 'spanish',
                    translation: 'español'
                })
            }
        })
    }
}
