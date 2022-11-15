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
import { Item, ItemByLanguage, Venue } from 'src/app/shared/models';
import { getFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VenuesService {

    private activeVenueSubject = new BehaviorSubject<Venue>(null)
    public activeVenue$ = this.activeVenueSubject.asObservable()

    private activeItemSubject = new BehaviorSubject<Item>(null)
    public activeItem$ = this.activeItemSubject.asObservable()

    private loadingVenuesSubject = new BehaviorSubject<boolean>(false)
    public loadingVenuew$ = this.loadingVenuesSubject.asObservable();

    private itemByLanguageSubject = new BehaviorSubject<ItemByLanguage>(null);
    public itemByLanguage$ = this.itemByLanguageSubject.asObservable();

    constructor(
        private firestore: Firestore,
        private storage: Storage) { }

    addVenue(venue: Venue) {
        const venueRef = collection(this.firestore, 'venues')
        return addDoc(venueRef, venue)
    }
    getVenues() {
        if (localStorage.getItem('venues')) {
            return JSON.parse(localStorage.getItem('venues')) as Observable<Venue[]>
        } else {
            const venuesRef = collection(this.firestore, 'venues')
            // const myVenues = collectionData(venuesRef, { idField: 'id' });
            return collectionData(venuesRef, { idField: 'id' }) as Observable<Venue[]>;
        }
    }

    getItems(venueId) {
        const itemsRef = collection(this.firestore, `venues/${venueId}/items`);
        return collectionData(itemsRef, { idField: 'id' }) as Observable<Item[]>
    }
    addItemToVenue(venueId: string, item: Item) {
        // console.log(venueId, item)
        const itemRef = collection(this.firestore, `venues/${venueId}/items`)
        return addDoc(itemRef, item)
    }
    getItem(venueId: string, itemId: string) {
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`);
        return docData(itemRef)
    }
    updateItem(venueId: string, itemId: string, item: Item) {
        localStorage.setItem('activeItem', JSON.stringify(item))
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
        return setDoc(itemRef, item);
    }
    deleteItem(venueId: string, itemId: string) {
        // console.log(venueId, itemId);
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
        return deleteDoc(itemRef)
    }

    editItemByLanguage(itemByLanguage: ItemByLanguage) {
        this.itemByLanguageSubject.next(itemByLanguage)
    }

    getVenueById(venueId) {
        const venueRef = doc(this.firestore, `venues/${venueId}`)
        return docData(venueRef, { idField: 'id' }) as Observable<Venue>
    }
    updateVenue(venue: Venue) {
        // console.log(venue)
        localStorage.setItem('activeVenue', JSON.stringify(venue))
        const venueRef = doc(this.firestore, `venues/${venue.id}`)
        return setDoc(venueRef, venue)
    }
    setActiveVenue(venue: Venue) {
        if (!venue) {
            if (localStorage.getItem('activeVenue')) {
                const venue: Venue = JSON.parse(localStorage.getItem('activeVenue'))
                this.activeVenueSubject.next(venue);
            }
        } else {
            this.activeVenueSubject.next(venue);
        }
    }
    setActiveItem(item: Item) {
        console.log('setting item');
        if (localStorage.getItem('activeItem')) {
            console.log('LS')
            const item: Item = JSON.parse(localStorage.getItem('activeItem'))
            this.activeItemSubject.next(item)
        } else {
            console.log('DB')
            localStorage.setItem('activeItem', JSON.stringify(item))
            this.activeItemSubject.next(item);
        }
    }

    deleteVenue(venueId: string) {
        const venueRef = doc(this.firestore, `venues/${venueId}`)
        return deleteDoc(venueRef)
    }

    async storeAudioFile(venueId: string, itemId: string, language: string, file: File | null) {
        console.log(venueId, itemId, language)
        const path = `venues/audio/${venueId}/${itemId}/${language}`; {
            if (file) {
                try {
                    const storageRef = ref(this.storage, path);
                    const task = uploadBytesResumable(storageRef, file);
                    await task;
                    const url = await getDownloadURL(storageRef);
                    return url
                } catch (e: any) {
                    console.error(e);
                }
            }
        }
    }
    deleteAudio(venueId: string, itemId: string, language: string) {
        const path = `venues/audio/${venueId}/${itemId}/${language}`;
        const storageRef = ref(this.storage, path)
        return deleteObject(storageRef);
    }

    async storeImageFile(
        venueId: string,
        itemId: string,
        file: File | null

    ): Promise<string> {
        // console.log(file.name)
        // console.log(folder, filename, file);

        // const ext = file!.name.split('.').pop();

        const path = `venues/images/${venueId}/${itemId}`; {

            // console.log(path);

            if (file) {
                try {
                    const storageRef = ref(this.storage, path);
                    const task = uploadBytesResumable(storageRef, file);
                    // this.uploadPercent = percentage(task);
                    await task;
                    const url = await getDownloadURL(storageRef);
                    const metadata = await getMetadata(storageRef);

                    // console.log(url)
                    // console.log(metadata.fullPath)

                    // const imageUploadData: ImageUploadData = {
                    //     imageUrl: url,
                    //     imageStoragePath: metadata.fullPath
                    // }
                    // return url;
                    // return imageUploadData
                    return url
                } catch (e: any) {
                    console.error(e);
                }
            }
        }
    }

    // removeImageUrlFromDB(venueId: string, itemId: string) {
    //     const itemsRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`);
    //     return updateDoc(itemsRef, { imageUrl: null })
    // }

    // deleteImage(venueId, itemId) {
    //     const path = `venues/images/${venueId}/${itemId}`;
    //     const storageRef = ref(this.storage, path)
    //     return deleteObject(storageRef)
    // }
    removeItemFromDB() {

    }
}
