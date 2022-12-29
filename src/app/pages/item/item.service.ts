import { Injectable } from '@angular/core';
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
    where,
    getDocs
} from '@angular/fire/firestore';

import { Console } from 'console';
import { Observable, BehaviorSubject } from 'rxjs';
import { ItemByLanguage, Venue } from 'src/app/shared/models';
import { Item, ItemVisit } from '../../shared/models';
import { UiService } from '../../shared/ui.service';

@Injectable({
    providedIn: 'root'
})
export class ItemService {

    venue: Venue
    visitCounted: boolean = false;

    private itemSubject = new BehaviorSubject<Item>(null);
    public item$ = this.itemSubject.asObservable();
    private mainPageSubject = new BehaviorSubject<Item>(null)
    public mainPage$ = this.mainPageSubject.asObservable()
    private availableLanguagesSubject = new BehaviorSubject<string[]>([])
    public availableLanguages$ = this.availableLanguagesSubject.asObservable()
    private audioUrlSubject = new BehaviorSubject<string>(null)
    public audioUrl$ = this.audioUrlSubject.asObservable()
    private activeVisitIdSubject = new BehaviorSubject<string>(null)
    public activeVisitId$ = this.activeVisitIdSubject.asObservable()


    constructor(
        private firestore: Firestore,
        private uiService: UiService) { }

    getItem(venueId: string, itemId: string) {
        console.log('GETTING ITEM: ', venueId, itemId);
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
        return docData(itemRef)
    }
    addVisit(venueId: string, itemId: string) {
        const itemVisit: ItemVisit = {
            timestamp: new Date().getTime(),
            liked: false
        }
        console.log(itemVisit)
        const visitRef = collection(this.firestore, `venues/${venueId}/visitsLog/${itemId}/visits`)
        return addDoc(visitRef, itemVisit)

    }

    updateAudioUrl(audioUrl: string) {
        this.audioUrlSubject.next(audioUrl);
    }
    getLocations(venueId) {
        console.log(venueId)
        const locationsRef = collection(this.firestore, `venues/${venueId}/locations`);
        return collectionData(locationsRef, { idField: 'id' })
    }

    // extractRequestedItem(itemId) {
    //     console.log('EXTRACTION REQUESTED ITEM')
    //     const soughtItems = this.venue.items.filter((item: Item) => {
    //         return item.id === itemId
    //     })
    //     console.log(soughtItems);
    //     this.itemSubject.next(soughtItems[0])
    //     this.collectAvailableLanguages(soughtItems[0])
    // }

    extractMainPage() {
        console.log(this.venue);
        const mainPageItems = this.venue.items.filter((item: Item) => {
            return item.isMainPage === true;
        })
        console.log(mainPageItems)
        this.mainPageSubject.next(mainPageItems[0]);
    }
    setMainPage() {
        const mainPageItems = this.venue.items.filter((item: Item) => {
            return item.isMainPage === true;
        })
        console.log(mainPageItems)
        this.itemSubject.next(mainPageItems[0])
    }

    collectAvailableLanguages(item: Item) {
        const availableLanguages: string[] = [];
        item.itemsByLanguage.forEach((itemByLanguage: ItemByLanguage) => {
            availableLanguages.push(itemByLanguage.language);
        })
        this.availableLanguagesSubject.next(availableLanguages)
    }
    getMainPageItem(venueId) {
        const itemsRef = collection(this.firestore, `venues/${venueId}/items`);
        const q = query(itemsRef, where('isMainPage', '==', true,));
        // collectionData(q, { idField: 'id' }).subscribe(data => console.log(data))
        return collectionData(q, { idField: 'id' })
    }
    setActiveVisitId(id: string) {
        this.activeVisitIdSubject.next(id);
    }

    like(venueId: string, itemId: string) {
        this.activeVisitId$.subscribe((visitId: string) => {
            console.log(venueId);
            console.log(itemId);
            console.log(visitId);
            const visitRef = doc(this.firestore, `venues/${venueId}/visitsLog/${itemId}/visits/${visitId}`);
            updateDoc(visitRef, { liked: true })
                .then((res: any) => console.log('item liked'))
                .catch(err => console.error(err));
        })
    }

    updateItemVisits(venueId: string, itemId: string) {
        // console.log(this.visitCounted)
        // const itemIndex: number = this.venue.items.findIndex((item: Item) => {
        //     return item.id === itemId;
        // })
        // if (!this.venue.items[itemIndex].timesVisited) {
        //     this.venue.items[itemIndex].timesVisited = 1;
        // } else {
        //     console.log('times visited')
        // }
        // console.log(this.venue.items[itemIndex].timesVisited);

    }
}
