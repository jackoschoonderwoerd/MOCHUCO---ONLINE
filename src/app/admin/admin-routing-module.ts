import { NgClass } from "@angular/common";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';


import { VenuesComponent } from './venues/venues.component';
import { AddVenueComponent } from './venues/add-venue/add-venue.component';
import { ItemsComponent } from "./venues/items/items.component";


import { DescriptionComponent } from './venues/items/add-item/languages/add-language/description/description.component';
import { AddItemComponent } from "./venues/items/add-item/add-item.component";
import { LanguagesComponent } from './venues/items/add-item/languages/languages.component';
import { AddLanguageComponent } from './venues/items/add-item/languages/add-language/add-language.component';
import { LoginComponent } from "./auth/login/login.component";




const routes: Routes = [
    { path: '', component: AdminComponent },
    { path: 'venues', component: VenuesComponent },

    { path: 'items', component: ItemsComponent },

    { path: 'description', component: DescriptionComponent },
    { path: 'add-venue', component: AddVenueComponent },
    { path: 'add-item', component: AddItemComponent },
    { path: 'languages', component: LanguagesComponent },
    { path: 'login', component: LoginComponent },
    { path: 'add-language', component: AddLanguageComponent }

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule { }
