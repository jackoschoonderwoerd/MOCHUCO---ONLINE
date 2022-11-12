import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  isInAppSubject = new BehaviorSubject<boolean>(false);
  isInApp$ = this.isInAppSubject.asObservable();

  isScanningSubject = new BehaviorSubject<boolean>(false);
  isScanning$ = this.isScanningSubject.asObservable();

  constructor() { }

  setIsInApp(status: boolean) {
    this.isInAppSubject.next(status)
  }
  setIsScanning(isScanning: boolean) {
    this.isScanningSubject.next(isScanning)
  }

}
