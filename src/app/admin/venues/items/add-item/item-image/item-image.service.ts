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

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ItemImageService {

    constructor(
        private storage: Storage,
        private firestore: Firestore) { }

    async storeImage(venueId: string, itemId: string, file: File): Promise<string> {
        console.log(venueId, itemId);
        if (file) {
            try {
                const path = `venues/${venueId}/items/${itemId}/image`

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
    removeImageFromStorage(venueId, itemId) {
        const path = `venues/${venueId}/items/${itemId}/image`;
        const storageRef = ref(this.storage, path)
        return deleteObject(storageRef)

    }
    removeImageUrlFromDB(venueId: string, itemId: string) {
        const itemsRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`);
        return updateDoc(itemsRef, { imageUrl: null })
    }
}
