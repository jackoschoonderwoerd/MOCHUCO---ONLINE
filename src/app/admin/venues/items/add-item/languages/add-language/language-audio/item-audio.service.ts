import { Injectable } from '@angular/core';

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

@Injectable({
    providedIn: 'root'
})
export class ItemAudioService {

    constructor(private storage: Storage) { }

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
}
