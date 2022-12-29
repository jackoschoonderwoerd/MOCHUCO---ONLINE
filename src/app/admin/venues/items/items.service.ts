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
import { Observable, BehaviorSubject } from 'rxjs';
import { Item, ItemByLanguage } from '../../../shared/models';

@Injectable({
    providedIn: 'root'
})
export class ItemsService {

    private itemByLanguageSubject = new BehaviorSubject<ItemByLanguage>(null);
    public itemByLanguage$ = this.itemByLanguageSubject.asObservable();

    // private activeItemSubject = new BehaviorSubject<Item>(null)
    // public activeItem$ = this.activeItemSubject.asObservable()

    constructor(
        private firestore: Firestore
    ) { }

    getItems(venueId) {
        const itemsRef = collection(this.firestore, `venues/${venueId}/items`);

        const alphabeticalQuery = query(itemsRef, orderBy("name"));
        return collectionData(alphabeticalQuery, { idField: 'id' }) as Observable<Item[]>
    }

    getItem(venueId: string, itemId: string) {
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`);
        return docData(itemRef, { idField: 'id' })
    }

    setItem(venueId: string, itemId: string, item: Item) {
        // localStorage.setItem('activeItem', JSON.stringify(item))
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
        return setDoc(itemRef, item);
    }
    setLocationAndIdToVenues(venueId: string, itemId: string, itemName: string, latitude: number, longitude: number) {
        const locationAndName = { latitude, longitude, itemName }
        const locationAndNameRef = doc(this.firestore, `venues/${venueId}/locations/${itemId}`);
        return setDoc(locationAndNameRef, locationAndName)
    }
    deleteLocation(venueId, itemId) {
        const locationRef = doc(this.firestore, `venues/${venueId}/locations/${itemId}`)
        return deleteDoc(locationRef);
    }

    addItemToVenue(venueId: string, item: Item) {
        const itemRef = collection(this.firestore, `venues/${venueId}/items`)
        return addDoc(itemRef, item)
    }

    deleteItem(venueId: string, itemId: string) {
        // console.log(venueId, itemId);
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
        return deleteDoc(itemRef)
    }
    editItemByLanguage(itemByLanguage: ItemByLanguage) {
        this.itemByLanguageSubject.next(itemByLanguage)
    }
    setItemByLanguage(itemByLanguage: ItemByLanguage) {
        console.log('setting IBL');
        this.itemByLanguageSubject.next(itemByLanguage);
    }
    // setActiveItem(item: Item) {
    //     console.log(item);
    //     this.activeItemSubject.next(item);
    // }

}
