import { Injectable } from '@angular/core';
import { VenuesService } from '../../../../../venues.service';
import { Item, ItemByLanguage } from '../../../../../../../shared/models';

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
} from '@angular/fire/storage'
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
import { ItemsService } from '../../../../items.service';

@Injectable({
    providedIn: 'root'
})
export class LanguageAudioService {

    constructor(
        private storage: Storage,
        private venuesService: VenuesService,
        private firestore: Firestore,
        private itemsService: ItemsService) { }

    async storeAudio(venueId: string, itemId: string, language: string, file: File): Promise<string> {
        const path = `venues/${venueId}/items/${itemId}/audio/${language}`
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

    removeAudioFromStorage(venueId, itemId, language) {
        const path = `venues/${venueId}/items/${itemId}/audio/${language}`
        const storageRef = ref(this.storage, path);
        return deleteObject(storageRef)

    }
    removeAudioFromDb(venueId, itemId, language) {
        console.log(venueId, itemId, language)

        const sub = this.itemsService.getItem(venueId, itemId).subscribe((item: Item) => {
            const itemByLanguageIndex = item.itemsByLanguage.findIndex((itemByLanguage: ItemByLanguage) => {
                return itemByLanguage.language === language;
            })
            item.itemsByLanguage[itemByLanguageIndex].itemLS.audioUrl = null;

            this.itemsService.setItem(venueId, itemId, item)
                .then(res => {
                    console.log('venue updated')
                    sub.unsubscribe();
                })
                .catch(err => console.log(err));
        })
    }
    // setItem(venueId: string, itemId: string, item: Item) {
    //     console.log(item);
    //     const itemRef = doc(this.firestore, `venues/${venueId},/items/${itemId}`)
    //     setDoc(itemRef, item)
    //         .then(res => console.log('item set'))
    //         .catch(err => console.log(err));
    // }

}
