import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// import { LanguageData } from './models';

import { SelectLanguageService } from '../navigation/footer/select-language/select-language.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Venue } from './models';
import { VenuesService } from '../admin/venues/venues.service';


@Injectable({
    providedIn: 'root'
})
export class UiService {

    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoadingSubject.asObservable();

    private isLoadingImageSubject = new BehaviorSubject<boolean>(false);
    public isLoadingImage$ = this.isLoadingImageSubject.asObservable();

    private isSearchingNearestItemSubject = new BehaviorSubject<boolean>(false);
    public isSearchingNearestItem$ = this.isSearchingNearestItemSubject.asObservable();

    private isFetchingItemDataSubject = new BehaviorSubject<boolean>(false)
    public isFetchingItemData$ = this.isFetchingItemDataSubject.asObservable();

    // private activeVenueSubject = new BehaviorSubject<Venue>(null);
    // public activeVenue$ = this.activeVenueSubject.asObservable();



    constructor(

        private selectLanguageService: SelectLanguageService,
        private venuesService: VenuesService

    ) { }

    setIsLoading(status: boolean) {
        // console.log('isLoading status: ', status);
        this.isLoadingSubject.next(status)
    }

    setIsLoadingImage(status: boolean) {
        console.log(status);
        this.isLoadingImageSubject.next(status);
    }
    setIsSearchingNearestItem(status: boolean) {
        this.isSearchingNearestItemSubject.next(status)
    }
    setIsFetchingItemData(status: boolean) {
        this.isFetchingItemDataSubject.next(status)
    }
    // setActiveVenue(venueId: string): void {
    //     console.log('setting venue')
    //     this.venuesService.getVenueById(venueId).subscribe((venue: Venue) => {
    //         this.activeVenueSubject.next(venue)
    //     })
    // }
}
