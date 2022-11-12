import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SelectLanguageService } from './select-language.service';
import { MatDialogRef } from '@angular/material/dialog';
import { UiService } from '../../../shared/ui.service';
// import { LanguageData } from 'src/app/shared/models';
import { LanguageService } from '../../../shared/language.service';
import { ItemService } from '../../../pages/item/item.service';

@Component({
    selector: 'app-select-language',
    templateUrl: './select-language.component.html',
    styleUrls: ['./select-language.component.scss']
})
export class SelectLanguageComponent implements OnInit {

    languages: string[]


    constructor(
        private selectLanguageService: SelectLanguageService,
        private dialogRef: MatDialogRef<SelectLanguageComponent>,
        private languageService: LanguageService,
        public itemService: ItemService,
        private uiService: UiService) { }

    ngOnInit(): void {
        this.languages = this.languageService.getLanguages();
        console.log(this.languages)
        // this.languages = this.selectLanguageService.getLanguages()
        // this.languages$ = this.selectLanguageService.getLanguages()
    }
    onLanguage(language) {
        console.log(language)
        this.languageService.setLanguage(language);
        this.dialogRef.close();
    }

}
