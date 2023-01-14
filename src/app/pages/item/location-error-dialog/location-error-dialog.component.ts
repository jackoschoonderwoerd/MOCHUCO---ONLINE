import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-location-error-dialog',
    templateUrl: './location-error-dialog.component.html',
    styleUrls: ['./location-error-dialog.component.scss']
})
export class LocationErrorDialogComponent implements OnInit {

    browserName;
    error;
    errorCode;
    device: string;
    userAgent: string;
    isMobile: boolean;

    constructor(
        private route: ActivatedRoute
        // @Inject(MAT_DIALOG_DATA) public data: any,
        // private dialogRef: MatDialogRef<LocationErrorDialogComponent>,
        // private ngZone: NgZone
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            if (!params) {
                alert('no params in location error dialog component')
            } else {
                this.errorCode = params.errorCode;
                // alert(' errorCode from location error dialog component: ' + this.errorCode)
            }
        })
        if (!navigator) {
            alert('no navigator');
            return;
        } else {
            if (!navigator.userAgent) {
                alert('no userAgent')
                return
            }
            this.getBrowser();
            this.getDevice();
            this.getIsMobile();
        }



        // var isMobile = navigator.userAgent.toLowerCase().match(/mobile/i),
        //     isTablet = navigator.userAgent.toLowerCase().match(/tablet/i),
        //     isAndroid = navigator.userAgent.toLowerCase().match(/android/i),
        //     isiPhone = navigator.userAgent.toLowerCase().match(/iphone/i),
        //     isiPad = navigator.userAgent.toLowerCase().match(/ipad/i);

        // (B) DETECTED DEVICE TYPE
        // console.log("Mobile", isMobile);
        // console.log("Tablet", isTablet);
        // console.log("Android", isAndroid);
        // console.log("iPhone", isiPhone);
        // console.log("iPad", isiPad);
        // });
    }
    // onClose(): void {
    //     this.ngZone.run(() => {
    //         alert('closing');
    //         this.dialogRef.close();
    //     })
    // }

    // USER AGENT: Mozilla/5.0 (iPhone; CPU iPhone OS 12_5_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1

    getDevice() {
        if (navigator) {
            if (navigator.userAgent) {
                this.userAgent = navigator.userAgent
                if (navigator.userAgent.toLowerCase().match(/tablet/i)) {
                    this.device = 'tablet'
                } else if (navigator.userAgent.toLowerCase().match(/android/i)) {
                    this.device = 'android'
                } else if (navigator.userAgent.toLowerCase().match(/iphone/i)) {
                    this.device = 'iphone'
                } else if (navigator.userAgent.toLowerCase().match(/ipad/i)) {
                    this.device = 'ipad'
                } else {
                    this.device = 'undetermined'
                }
            }
        }
    }
    getBrowser() {
        if (navigator) {
            if (navigator.userAgent) {
                if (navigator.userAgent.match(/chrome|chromium|crios/i)) {
                    this.browserName = "chrome";
                } else if (navigator.userAgent.match(/firefox|fxios/i)) {
                    this.browserName = "firefox";
                } else if (navigator.userAgent.match(/safari/i)) {
                    this.browserName = "safari";
                } else if (navigator.userAgent.match(/opr\//i)) {
                    this.browserName = "opera";
                } else if (navigator.userAgent.match(/edg/i)) {
                    this.browserName = "edge";
                } else {
                    this.browserName = "No browser detection";
                }
            }
        }
    }
    getIsMobile() {
        if (navigator) {
            if (navigator.userAgent) {
                this.userAgent = navigator.userAgent
                if (navigator.userAgent.toLowerCase().match(/mobile/i)) {
                    this.isMobile = true;

                } else {
                    this.isMobile = false
                }
            }
        }
    }
    getOs() {

    }
}
