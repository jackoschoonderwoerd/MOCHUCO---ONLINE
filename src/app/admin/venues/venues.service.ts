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
    query,
    where
} from '@angular/fire/firestore';
import { Item, ItemByLanguage, Venue } from 'src/app/shared/models';
import { getFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class VenuesService {

    private activeVenueSubject = new BehaviorSubject<Venue>(null)
    public activeVenue$ = this.activeVenueSubject.asObservable()

    private loadingVenuesSubject = new BehaviorSubject<boolean>(false)
    public loadingVenuew$ = this.loadingVenuesSubject.asObservable();

    constructor(
        private firestore: Firestore,
        private storage: Storage,
        private afAuth: Auth) { }

    addVenue(venue: Venue) {
        const venueRef = collection(this.firestore, 'venues')
        return addDoc(venueRef, venue)
    }
    updateUser(venueId: string) {
        const userId = this.afAuth.currentUser.uid

        console.log('updating user', userId)
        const userRef = doc(this.firestore, `users/${userId}`);
        const coursesOwnedRef = doc(this.firestore, `users/${userId}/venuesOwned/${venueId}`);
        return setDoc(coursesOwnedRef, {})
        // return setDoc(coursesOwnedRef, venueId)
        // const subscription = docData(userRef).subscribe((data: any) => {
        //     if (data) {
        //         venuesOwnedArray = data.venuesOwned
        //     }
        //     venuesOwnedArray.push(venueId)
        //     console.log('pushing', venuesOwnedArray)
        //     const venuesOwnedRef = doc(this.firestore, `users/${userId}`)
        //     subscription.unsubscribe()
        //     updateDoc(venuesOwnedRef, { venuesOwned: venuesOwnedArray })
        //         .then((res) => {
        //             console.log(res);
        //         })
        //         .catch(err => {
        //             console.log(err);
        //         });
        // });

        // const userRef = doc(this.firestore, `users/${userId}`)
        // return updateDoc(userRef, { venuesOwned: [venueId] })
    }
    getVenues() {
        // this.afAuth.
        console.log(this.afAuth.currentUser.uid)
        const venuesRef = collection(this.firestore, 'venues');
        // const orderQuery = query(venuesRef, orderBy('name'));
        const venuesQuery = query(venuesRef, where('owner', '==', this.afAuth.currentUser.uid), orderBy('name'),);

        return collectionData(venuesQuery, { idField: 'id' }) as Observable<Venue[]>;
    }
    getVenueById(venueId) {
        const venueRef = doc(this.firestore, `venues/${venueId}`)
        return docData(venueRef, { idField: 'id' }) as Observable<Venue>
    }
    updateVenue(venueId: string, name: string) {
        const venueRef = doc(this.firestore, `venues/${venueId}`)
        return updateDoc(venueRef, { name: name })
    }
    deleteVenue(venueId: string) {
        console.log('deleting venue', venueId)
        const venueRef = doc(this.firestore, `venues/${venueId}`)
        return deleteDoc(venueRef)
    }

    // addItemToVenue(venueId: string, item: Item) {
    //     const itemRef = collection(this.firestore, `venues/${venueId}/items`)
    //     return addDoc(itemRef, item)
    // }

    deleteVenueStorage(venueId: string) {
        const venueRef = ref(this.storage, `venues/${venueId}`)
        return getMetadata(venueRef)
    }

    // setVenue(venue: Venue) {
    //     const venueRef = doc(this.firestore, `venues/${venue.id}`)
    //     return setDoc(venueRef, venue)
    // }

    // setActiveVenue(venue: Venue) {
    //     if (!venue) {
    //         if (localStorage.getItem('activeVenue')) {
    //             const venue: Venue = JSON.parse(localStorage.getItem('activeVenue'))
    //             this.activeVenueSubject.next(venue);
    //         }
    //     } else {
    //         this.activeVenueSubject.next(venue);
    //     }
    // }
}
