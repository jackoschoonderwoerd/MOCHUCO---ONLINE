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
import { AppAuthGuard } from '../app-auth-guard.service';
import { StatisticsComponent } from "./venues/statistics/statistics.component";




const routes: Routes = [
    { path: '', component: AdminComponent },
    { path: 'venues', canActivate: [AppAuthGuard], component: VenuesComponent },

    { path: 'items', canActivate: [AppAuthGuard], component: ItemsComponent },

    { path: 'description', canActivate: [AppAuthGuard], component: DescriptionComponent },
    { path: 'add-venue', canActivate: [AppAuthGuard], component: AddVenueComponent },
    { path: 'add-item', canActivate: [AppAuthGuard], component: AddItemComponent },
    { path: 'languages', canActivate: [AppAuthGuard], component: LanguagesComponent },
    { path: 'login', component: LoginComponent },
    { path: 'add-language', canActivate: [AppAuthGuard], component: AddLanguageComponent },
    { path: 'statistics', canActivate: [AppAuthGuard], component: StatisticsComponent }

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule { }
