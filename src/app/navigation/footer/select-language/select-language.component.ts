import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SelectLanguageService } from './select-language.service';
import { MatDialogRef } from '@angular/material/dialog';
import { UiService } from '../../../shared/ui.service';
// import { LanguageData } from 'src/app/shared/models';
import { LanguageService } from '../../../shared/language.service';
import { ItemService } from '../../../pages/item/item.service';

export interface TranslatedLanguageObject {
    name: string;
    translation: string;
}

@Component({
    selector: 'app-select-language',
    templateUrl: './select-language.component.html',
    styleUrls: ['./select-language.component.scss']
})



export class SelectLanguageComponent implements OnInit {


    languages: string[];
    translatedLanguageObjects: TranslatedLanguageObject[] = [];


    constructor(
        private selectLanguageService: SelectLanguageService,
        private dialogRef: MatDialogRef<SelectLanguageComponent>,
        private languageService: LanguageService,
        public itemService: ItemService,
        private uiService: UiService) { }

    ngOnInit(): void {
        this.languages = this.languageService.getLanguages();
        console.log(this.languages)
        this.translateLanguages();
        // this.languages = this.selectLanguageService.getLanguages()
        // this.languages$ = this.selectLanguageService.getLanguages()
    }
    onLanguage(languageName: string) {
        // console.log(languageName)
        this.languageService.setLanguage(languageName);
        this.dialogRef.close();
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
