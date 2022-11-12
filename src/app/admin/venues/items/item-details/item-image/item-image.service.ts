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

    async storeImage(file: File): Promise<string> {

        if (file) {
            try {
                const storageRef = ref(this.storage, 'images');
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
