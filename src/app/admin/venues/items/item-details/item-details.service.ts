import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VenuesService } from '../../venues.service';
import { Item, Venue } from '../../../../shared/models';
import { ItemByLanguage } from 'src/app/shared/models';
import { LanguageService } from '../../../../shared/language.service';
import {
    Storage,
    ref,
    deleteObject,
    uploadBytes,
    uploadString,
    uploadBytesResumable,
    percentage,
    getDownloadURL,
    getMetadata,
    provideStorage,
    getStorage,
    getBytes,
} from '@angular/fire/storage';


@Injectable({
    providedIn: 'root'
})
export class ItemDetailsService {

    private descriptionChangedSubject = new BehaviorSubject<string>('')
    public descriptionChanged$ = this.descriptionChangedSubject.asObservable()

    private uploadingAudioSubject = new BehaviorSubject<boolean>(false)
    public uploadingAudio$ = this.uploadingAudioSubject.asObservable()

    private uploadingImageSubject = new BehaviorSubject<boolean>(false)
    public uploadingImage$ = this.uploadingImageSubject.asObservable()

    private availableLanguagesSubject = new BehaviorSubject<string[]>([])
    public avialableLanguages$ = this.availableLanguagesSubject.asObservable();

    constructor(
        private storage: Storage,
        private venuesService: VenuesService,
        private languageService: LanguageService) { }

    audioUploadStatus(status: boolean) {
        this.uploadingAudioSubject.next(status);
    }
    imageUploadStatus(status: boolean) {
        this.uploadingImageSubject.next(status);
    }
    updateDescription(description: string) {
        console.log('updating description')
        this.descriptionChangedSubject.next(description);
    }

    async storeImage(venueId: string, itemId: string, file: File): Promise<string> {
        const path = `venues/${venueId}/images/${itemId}`;
        if (file) {
            try {
                const storageRef = ref(this.storage, path);
                const task = uploadBytesResumable(storageRef, file);
                await task;
                const url = await getDownloadURL(storageRef);
                return url
            } catch (e: any) {
                console.error(e)
            }
        }
    }
    deleteImage(venueId: string, itemId: string) {
        console.log(venueId, itemId);
        const path = `venues/${venueId}/images/${itemId}`;
        const storageRef = ref(this.storage, path)
        return deleteObject(storageRef)
    }

    async storeAudio(venueId: string, itemId: string, language: string, file: File): Promise<string> {

        console.log(venueId, itemId, language);

        const path = `venues/${venueId}/audio/${itemId}/${language}`;
        if (file) {
            try {
                const storageRef = ref(this.storage, path);
                const task = uploadBytesResumable(storageRef, file);
                await task;
                const url = await getDownloadURL(storageRef);
                return url
            } catch (e: any) {
                console.error(e)
            }
        }
    }

    deleteAudio(venueId: string, itemId: string, language: string,) {
        console.log(venueId, itemId, language)
        const path = `venues/${venueId}/audio/${itemId}/${language}`;
        const storagRef = ref(this.storage, path)
        return deleteObject(storagRef);
    }

    // deleteAllDataFromStorage(venueId) {
    //     const path = `venues/${venueId}`
    //     const storageRef = ref(this.storage, path)
    //     return deleteObject(storageRef)
    // }

    checkForAlvailableLanguages(itemId) {
        const languages: string[] = this.languageService.getLanguages()
        this.venuesService.activeVenue$.subscribe((venue: Venue) => {
            const itemIndex = venue.items.findIndex((item: Item) => {
                return item.id === itemId
            })
            const occupiedLanguages: string[] = []
            venue.items[itemIndex].itemsByLanguage.forEach((itemByLanguage: ItemByLanguage) => {
                occupiedLanguages.push(itemByLanguage.language)
            })
            const availableLanguages: string[] = [];

            languages.forEach((language: string) => {
                if (occupiedLanguages.indexOf(language) === -1) {
                    availableLanguages.push(language)
                }
            });
            console.log(availableLanguages)
            // if (this.languages.length === 0) {
            //     this.languages = ['all available langages are being used']
            // }
            this.availableLanguagesSubject.next(availableLanguages)

        })
    }
}
