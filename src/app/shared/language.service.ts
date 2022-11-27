import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    languages: string[] = ['dutch', 'english', 'german', 'french', 'spanish']


    private languageSubject = new BehaviorSubject<string>('dutch');
    public language$ = this.languageSubject.asObservable()


    constructor() { }

    getLanguages() {
        return this.languages;
    }

    setLanguage(language) {
        this.languageSubject.next(language);
    }
    setAvailableLanguages(languages: string[]) {
        this.languages = languages;
    }

}
