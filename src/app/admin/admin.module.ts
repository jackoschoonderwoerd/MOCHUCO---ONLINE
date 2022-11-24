import { AddItemComponent } from './venues/items/add-item/add-item.component';
import { AddVenueComponent } from './venues/add-venue/add-venue.component';
import { AdminMaterialModule } from './admin-material.module';
import { AdminRoutingModule } from './admin-routing-module';
import { CommonModule } from '@angular/common';
import { ConfirmDeleteComponent } from '../shared/confirm-delete/confirm-delete.component';
import { DescriptionComponent } from './venues/items/add-item/languages/add-language/description/description.component';
import { DownloadQrComponent } from './venues/items/qr-code/download-qr/download-qr.component';


import { ItemImageComponent } from './venues/items/add-item/item-image/item-image.component';

import { ItemsComponent } from './venues/items/items.component';
import { NgModule } from '@angular/core';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';
import { ReactiveFormsModule } from '@angular/forms';
import { VenuesComponent } from './venues/venues.component';
import { AddLanguageComponent } from './venues/items/add-item/languages/add-language/add-language.component';
import { QrCodeComponent } from './venues/items/qr-code/qr-code.component';
import { LanguageAudioComponent } from './venues/items/add-item/languages/add-language/language-audio/language-audio.component';
import { ImageDialogComponent } from './venues/items/image-dialog/image-dialog.component';
import { DeleteVenueDialogComponent } from './venues/delete-venue-dialog/delete-venue-dialog.component';
import { LoginComponent } from './auth/login/login.component';
import { PermissionDeniedDialogComponent } from './shared/permission-denied-dialog/permission-denied-dialog.component';






@NgModule({
    declarations: [


        AddItemComponent,
        AddLanguageComponent,
        AddVenueComponent,
        ConfirmDeleteComponent,
        DeleteVenueDialogComponent,
        DescriptionComponent,
        DownloadQrComponent,
        ImageDialogComponent,
        ItemImageComponent,
        ItemsComponent,
        LanguageAudioComponent,
        LoginComponent,
        QrCodeComponent,
        VenuesComponent,
        PermissionDeniedDialogComponent,


    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        AdminMaterialModule,
        ReactiveFormsModule,
        NgxQrcodeStylingModule
    ]
})
export class AdminModule { }
