import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    languages: string[] = ['dutch', 'english', 'german', 'french', 'spanish']


    private languageSubject = new BehaviorSubject<string>('dutch');
    public language$ = this.languageSubject.asObservable()
    private availableLanguagesSubject = new BehaviorSubject<string[]>([])
    public availableLanguages$ = this.availableLanguagesSubject.asObservable()


    constructor() { }

    getLanguages() {
        return this.languages;
    }

    setLanguage(language) {
        console.log(language);
        this.languageSubject.next(language);
    }
    setAvailableLanguages(availableLanguages: string[]) {
        console.log('setting available languages', availableLanguages)
        this.languages = availableLanguages;
        this.availableLanguagesSubject.next(availableLanguages)
    }


}
