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
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

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
        private afAuth: Auth,
        private authService: AuthService,
        private router: Router) { }

    addVenue(venue: Venue) {
        console.log(this.afAuth.currentUser.uid);
        const venueRef = collection(this.firestore, 'venues')
        return addDoc(venueRef, venue)
    }
    updateUser(venueId: string) {
        const userId = this.afAuth.currentUser.uid

        console.log('updating user', userId)
        // const userRef = doc(this.firestore, `users/${userId}`);
        const coursesOwnedRef = doc(this.firestore, `users/${userId}/venuesOwned/${venueId}`);
        return setDoc(coursesOwnedRef, {})
    }

    // updateAdmin(venueId) {
    //     const userId = this.afAuth.currentUser.uid

    //     console.log('updating admin', userId)
    //     // const userRef = doc(this.firestore, `users/${userId}`);
    //     const coursesOwnedRef = doc(this.firestore, `users/8Yb9nGiE8Wf7B7jRjlfrFt0NNq93/venuesOwned/${venueId}`);
    //     return setDoc(coursesOwnedRef, {})
    // }
    getVenues() {
        // this.authService.
        // console.log(this.afAuth.currentUser.uid);
        if (!this.afAuth.currentUser) {
            alert('please log in')
            this.router.navigateByUrl('/admin/login');
            this.authService.logout()
        } else {
            const venuesRef = collection(this.firestore, 'venues');
            if (this.afAuth.currentUser.uid !== '8Yb9nGiE8Wf7B7jRjlfrFt0NNq93') {
                const venuesQuery = query(venuesRef, where('owner', '==', this.afAuth.currentUser.uid), orderBy('name'),);
                return collectionData(venuesQuery, { idField: 'id' }) as Observable<Venue[]>;

            } else {
                const venuesQuery = query(venuesRef, orderBy('name'),);
                return collectionData(venuesQuery, { idField: 'id' }) as Observable<Venue[]>;
            }
        }


    }
    getVenueById(venueId) {
        console.log
        const venueRef = doc(this.firestore, `venues/${venueId}`)
        return docData(venueRef, { idField: 'id' }) as Observable<Venue>
    }
    updateVenue(venueId: string, name: string, logoUrl) {
        const venueRef = doc(this.firestore, `venues/${venueId}`)
        return updateDoc(venueRef, { name: name, logoUrl: logoUrl })
    }
    deleteVenue(venueId: string) {
        console.log('deleting venue', venueId)
        const venueRef = doc(this.firestore, `venues/${venueId}`)
        return deleteDoc(venueRef)
    }
    removeVenueIdFromCoursesOwned(venueId) {
        const coursesOwnedVenueIdRef = doc(this.firestore, `users/${this.afAuth.currentUser.uid}/venuesOwned/${venueId}`)
        return deleteDoc(coursesOwnedVenueIdRef)
    }
    // addItemToVenue(venueId: string, item: Item) {
    //     const itemRef = collection(this.firestore, `venues/${venueId}/items`)
    //     return addDoc(itemRef, item)
    // }
    async storeLogo(venueId: string, file: File) {
        if (file) {
            try {
                const path = `venues/${venueId}/logo`
                const storageRef = ref(this.storage, path);
                const task = uploadBytesResumable(storageRef, file);
                await task;
                const url = await getDownloadURL(storageRef)
                return url;
            } catch (e: any) {
                console.log(e);
            }
        }
    }
    removeLogoFromStorage(venueId: string) {
        console.log(venueId)
        const logoRef = ref(this.storage, `venues/${venueId}/logo`);
        return deleteObject(logoRef)
    }

    removeLogoUrlFromDb(venueId) {
        const logoUrlRef = doc(this.firestore, `venues/${venueId}/`)
        return updateDoc(logoUrlRef, { logoUrl: null })
    }

    deleteVenueStorage(venueId: string) {
        const venueRef = ref(this.storage, `venues/${venueId}`)
        return getMetadata(venueRef)
    }

    // setVenue(venue: Venue) {
    //     const venueRef = doc(this.firestore, `venues/${venue.id}`)
    //     return setDoc(venueRef, venue)
    // }

    setActiveVenue(venueId: string) {
        console.log('setting active venue')
        this.getVenueById(venueId).subscribe((venue: Venue) => {
            this.activeVenueSubject.next(venue);
        })
    }
}
