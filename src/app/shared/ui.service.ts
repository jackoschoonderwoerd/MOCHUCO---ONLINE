import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// import { LanguageData } from './models';

import { SelectLanguageService } from '../navigation/footer/select-language/select-language.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
    providedIn: 'root'
})
export class UiService {

    isLoadingSubject = new BehaviorSubject<boolean>(false);
    isLoading$ = this.isLoadingSubject.asObservable();

    private isLoadingImageSubject = new BehaviorSubject<boolean>(false);
    public isLoadingImage$ = this.isLoadingImageSubject.asObservable()



    constructor(

        private selectLanguageService: SelectLanguageService,

    ) { }

    setIsLoading(status: boolean) {
        // console.log('isLoading status: ', status);
        this.isLoadingSubject.next(status)
    }

    setIsLoadingImage(status: boolean) {
        console.log(status);
        this.isLoadingImageSubject.next(status);
    }
}
