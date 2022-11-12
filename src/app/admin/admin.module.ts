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





@NgModule({
    declarations: [

        AddItemComponent,
        AddVenueComponent,
        ConfirmDeleteComponent,
        DescriptionComponent,
        DownloadQrComponent,
        LanguageAudioComponent,
        ItemImageComponent,

        ItemsComponent,
        VenuesComponent,
        AddLanguageComponent,
        QrCodeComponent,

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
