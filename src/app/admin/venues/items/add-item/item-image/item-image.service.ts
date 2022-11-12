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
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ItemImageService {

    constructor(private storage: Storage) { }

    async storeImage(venueId: string, itemId: string, file: File): Promise<string> {
        console.log(venueId, itemId);
        if (file) {
            try {
                const path = `venues/${venueId}/items/${itemId}`

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
