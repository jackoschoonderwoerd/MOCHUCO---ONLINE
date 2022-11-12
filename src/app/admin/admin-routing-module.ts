import { NgClass } from "@angular/common";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';


import { VenuesComponent } from './venues/venues.component';
import { AddVenueComponent } from './venues/add-venue/add-venue.component';
import { ItemsComponent } from "./venues/items/items.component";
import { ItemDetailsComponent } from './venues/items/item-details/item-details.component';

import { DescriptionComponent } from './venues/items/item-details/description/description.component';
import { AddItemComponent } from "./venues/items/add-item/add-item.component";
import { LanguagesComponent } from './venues/items/add-item/languages/languages.component';
import { AddLanguageComponent } from './venues/items/add-item/languages/add-language/add-language.component';




const routes: Routes = [
    { path: '', component: AdminComponent },
    { path: 'venues', component: VenuesComponent },

    { path: 'items', component: ItemsComponent },
    { path: 'item-details', component: ItemDetailsComponent },
    { path: 'description', component: DescriptionComponent },
    { path: 'add-venue', component: AddVenueComponent },
    { path: 'add-item', component: AddItemComponent },
    { path: 'languages', component: LanguagesComponent },
    { path: 'add-language', component: AddLanguageComponent }

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule { }
