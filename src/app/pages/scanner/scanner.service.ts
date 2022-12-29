import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

@Injectable({
    providedIn: 'root'
})
export class ScannerService {

    isInAppSubject = new BehaviorSubject<boolean>(false);
    isInApp$ = this.isInAppSubject.asObservable();

    isScanningSubject = new BehaviorSubject<boolean>(false);
    isScanning$ = this.isScanningSubject.asObservable();

    constructor(
        private fireStore: Firestore
    ) { }

    setIsInApp(status: boolean) {
        this.isInAppSubject.next(status)
    }
    setIsScanning(isScanning: boolean) {
        this.isScanningSubject.next(isScanning)
    }


}
