import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './navigation/footer/footer.component';
import { ScannerComponent } from './pages/scanner/scanner.component';



import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material.module';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MochucoComponent } from './pages/mochuco/mochuco.component';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { QRCodeModule } from 'angular2-qrcode';
import { TestComponent } from './pages/test/test.component';
import { LogoComponent } from './pages/logo/logo.component';

import { UiDialogComponent } from './shared/ui-dialog/ui-dialog.component';
import { SelectLanguageComponent } from './navigation/footer/select-language/select-language.component';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminComponent } from './admin/admin.component';
import { StageComponent } from './pages/stage/stage.component';
import { ItemComponent } from './pages/item/item.component';
import { LanguagesComponent } from './admin/venues/items/add-item/languages/languages.component';
import { WarningComponent } from './shared/warning/warning.component';








@NgModule({
    declarations: [
        AdminComponent,
        AppComponent,
        FooterComponent,
        HeaderComponent,
        HomeComponent,
        LogoComponent,
        MochucoComponent,
        ScannerComponent,
        SelectLanguageComponent,
        TestComponent,
        UiDialogComponent,
        StageComponent,
        ItemComponent,
        LanguagesComponent,
        WarningComponent,


    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        NgxScannerQrcodeModule,
        AppMaterialModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),
        BrowserAnimationsModule,
        QRCodeModule,
        ReactiveFormsModule,



        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            scope: './',

            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',

        }),

        provideAuth(() => getAuth()),
        provideStorage(() => getStorage()),
        // ServiceWorkerModule.register('ngsw-worker.js', {
        //   enabled: environment.production,
        //   // Register the ServiceWorker as soon as the application is stable
        //   // or after 30 seconds (whichever comes first).
        //   registrationStrategy: 'registerWhenStable:30000'
        // }),

    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
