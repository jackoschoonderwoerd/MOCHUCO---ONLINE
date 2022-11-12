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
    query
} from '@angular/fire/firestore';
import { Console } from 'console';
import { Observable, BehaviorSubject } from 'rxjs';
import { ItemByLanguage, Venue } from 'src/app/shared/models';
import { Item } from '../../shared/models';
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

    constructor(
        private firestore: Firestore,
        private uiService: UiService) { }

    getItem(venueId: string, itemId: string) {
        console.log('GETTING ITEM: ', venueId, itemId);
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
        return docData(itemRef)
    }

    extractRequestedItem(itemId) {
        console.log('EXTRACTION REQUESTED ITEM')
        const soughtItems = this.venue.items.filter((item: Item) => {
            return item.id === itemId
        })
        console.log(soughtItems);
        this.itemSubject.next(soughtItems[0])
        this.collectAvailableLanguages(soughtItems[0])
    }
    extractMainPage() {
        // console.log(this.venue);
        // const mainPageItems = this.venue.items.filter((item: Item) => {
        //     return item.isMainPage === true;
        // })
        // this.mainPageSubject.next(mainPageItems[0]);
    }
    setMainPage() {
        // const mainPageItems = this.venue.items.filter((item: Item) => {
        //     return item.isMainPage === true;
        // })
        // this.itemSubject.next(mainPageItems[0])
    }

    collectAvailableLanguages(item: Item) {
        const availableLanguages: string[] = [];
        item.itemsByLanguage.forEach((itemByLanguage: ItemByLanguage) => {
            availableLanguages.push(itemByLanguage.language);
        })
        this.availableLanguagesSubject.next(availableLanguages)
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
