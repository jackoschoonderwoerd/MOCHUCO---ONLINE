
import { AdminComponent } from './admin/admin.component';
import { AppComponent } from './app.component';
import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AudioComponent } from './pages/item/audio/audio.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { FooterComponent } from './navigation/footer/footer.component';
import { HeaderComponent } from './navigation/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { ItemComponent } from './pages/item/item.component';
import { LanguagesComponent } from './admin/venues/items/add-item/languages/languages.component';
import { LogoComponent } from './pages/logo/logo.component';
import { MainPageComponent } from './navigation/header/main-page/main-page.component';
import { MapComponent } from './navigation/header/main-page/map/map.component';
import { MochucoComponent } from './pages/mochuco/mochuco.component';
import { NgModule } from '@angular/core';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { QRCodeModule } from 'angular2-qrcode';
import { ReactiveFormsModule } from '@angular/forms';
import { ScannerComponent } from './pages/scanner/scanner.component';
import { SelectLanguageComponent } from './navigation/footer/select-language/select-language.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StatusComponent } from './navigation/header/status/status.component';
import { UiDialogComponent } from './shared/ui-dialog/ui-dialog.component';
import { WarningComponent } from './shared/warning/warning.component';
import { LocationErrorDialogComponent } from './pages/item/location-error-dialog/location-error-dialog.component';








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

        UiDialogComponent,

        ItemComponent,
        LanguagesComponent,
        WarningComponent,
        AudioComponent,
        MainPageComponent,
        MapComponent,
        StatusComponent,
        LocationErrorDialogComponent


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
