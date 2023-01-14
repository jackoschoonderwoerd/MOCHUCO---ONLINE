import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ScannerComponent } from './pages/scanner/scanner.component';




import { MochucoComponent } from './pages/mochuco/mochuco.component';
import { LogoComponent } from './pages/logo/logo.component';

import { ItemComponent } from './pages/item/item.component';
import { AppAuthGuard } from './app-auth-guard.service';
import { LocationErrorDialogComponent } from './pages/item/location-error-dialog/location-error-dialog.component';

const routes: Routes = [
    { path: '', redirectTo: 'mochuco', pathMatch: 'full' },
    { path: 'logo', component: LogoComponent },
    { path: 'home', component: HomeComponent },
    { path: 'scanner', component: ScannerComponent },
    { path: 'location-error', component: LocationErrorDialogComponent },


    { path: 'mochuco', component: MochucoComponent },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: 'item', component: ItemComponent },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
