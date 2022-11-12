import { AddItemComponent } from './venues/items/add-item/add-item.component';
import { AddVenueComponent } from './venues/add-venue/add-venue.component';
import { AdminMaterialModule } from './admin-material.module';
import { AdminRoutingModule } from './admin-routing-module';
import { CommonModule } from '@angular/common';
import { ConfirmDeleteComponent } from '../shared/confirm-delete/confirm-delete.component';
import { DescriptionComponent } from './venues/items/item-details/description/description.component';
import { DownloadQrComponent } from './venues/items/item-details/item-qr/download-qr/download-qr.component';
import { ItemAudioComponent } from './venues/items/item-details/item-audio/item-audio.component';
import { ItemDetailsComponent } from './venues/items/item-details/item-details.component';
import { ItemImageComponent } from './venues/items/item-details/item-image/item-image.component';
import { ItemQrComponent } from './venues/items/item-details/item-qr/item-qr.component';
import { ItemsComponent } from './venues/items/items.component';
import { NgModule } from '@angular/core';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';
import { ReactiveFormsModule } from '@angular/forms';
import { VenuesComponent } from './venues/venues.component';
import { AddLanguageComponent } from './venues/items/add-item/languages/add-language/add-language.component';
import { QrCodeComponent } from './venues/items/qr-code/qr-code.component';





@NgModule({
    declarations: [

        AddItemComponent,
        AddVenueComponent,
        ConfirmDeleteComponent,
        DescriptionComponent,
        DownloadQrComponent,
        ItemAudioComponent,
        ItemDetailsComponent,
        ItemImageComponent,
        ItemQrComponent,
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
