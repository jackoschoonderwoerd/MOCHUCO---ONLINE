import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScannerService } from '../../pages/scanner/scanner.service';
import { UiService } from '../../shared/ui.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectLanguageComponent } from './select-language/select-language.component';

import { Observable } from 'rxjs';
// import { LanguageData } from 'src/app/shared/models';
import { SelectLanguageService } from './select-language/select-language.service';
import { LanguageService } from '../../shared/language.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    // selectedLanguage$: Observable<LanguageData>
    // languages$: Observable<LanguageData[]>
    languages: string[]

    constructor(
        private router: Router,
        public scannerService: ScannerService,
        public uiService: UiService,
        private dialog: MatDialog,
        private selectLanguageService: SelectLanguageService,
        private languageService: LanguageService
    ) { }

    ngOnInit(): void {
        // this.selectedLanguage$ = this.uiService.selectedLanguage$
        this.selectLanguageService.setLanguage('2lYEBd3kQ1EFZMb0JdDU')
        // this.languages$ = this.selectLanguageService.getLanguages()
        this.languages = this.languageService.getLanguages();
    }
    onScanner() {
        this.router.navigateByUrl('scanner')
    }
    onSelectLanguage(language: string) {
        // this.uiService.setLanguage(language)
        this.selectLanguageService.setLanguage(language)
    }
    onLanguageSelector() {
        const dialogRef = this.dialog.open(SelectLanguageComponent)
    }
}
