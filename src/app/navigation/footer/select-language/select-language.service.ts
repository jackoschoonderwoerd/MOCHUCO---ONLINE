import { Injectable } from '@angular/core';
import { getModularInstance } from '@firebase/util';

import {
    Firestore,
    addDoc,
    collection,
    collectionData,
    collectionGroup,
    doc,
    docData,
    deleteDoc,
    updateDoc,
    DocumentReference,
    setDoc,
    orderBy,
    query
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
// import { LanguageData } from 'src/app/shared/models';



@Injectable({
    providedIn: 'root'
})
export class SelectLanguageService {

    defaultLanguage = 'nl'
    languages: string[] = ['dutch', 'german', 'french', 'english', 'italian', 'spanish', 'japanese']





    private selectedLanguageSubject = new BehaviorSubject<string>(this.defaultLanguage)
    public selectedLanguage$ = this.selectedLanguageSubject.asObservable();
    public selectedLanguage: string

    constructor(private firestore: Firestore) { }

    getLanguages() {
        return this.languages;
    }



    setLanguage(id: string) {
        const languageRef = doc(this.firestore, `languages/${id}`);
        // docData(languageRef).subscribe((language: LanguageData) => {
        //     this.selectedLanguageSubject.next(language);
        // })
    }
}
// AR Arabic
// BE Belarusian
// BG Bulgarian
// CS Czech
// CY Welsh
// DA Danish
// DE German
// EL Greek
// EN English
// EO Esperanto
// ES Spanish
// ET Estonian
// FI Finnish
// FR French
// GA Irish
// GD Scottish Gaelic
// HU Hungarian
// HY Armenian
// ID Indonesian
// IS Icelandic
// IT Italian
// JA Japanese
// KO Korean
// LT Lithuanian
// LV Latvian
// MK / SL Macedonian
// MN Mongolian
// MO Moldavian
// NE Nepali
// NL Dutch
// NN Norwegian
// PL Polish
// PT Portuguese
// RO Romanian
// RU Russian
// SK Slovak
// SL Slovenian
// SQ Albanian
// SR Serbian
// SV Swedish
// TH Thai
// TR Turkish
// UK Ukrainian
// VI Vietnamese
// YI Yiddish
// ZH Chinese
