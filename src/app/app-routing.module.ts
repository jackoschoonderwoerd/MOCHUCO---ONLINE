import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ScannerComponent } from './pages/scanner/scanner.component';



import { MochucoComponent } from './pages/mochuco/mochuco.component';
import { LogoComponent } from './pages/logo/logo.component';
import { StageComponent } from './pages/stage/stage.component';
import { ItemComponent } from './pages/item/item.component';

const routes: Routes = [
    { path: '', redirectTo: 'mochuco', pathMatch: 'full' },
    { path: 'logo', component: LogoComponent },
    { path: 'home', component: HomeComponent },
    { path: 'scanner', component: ScannerComponent },

    { path: 'stage', component: StageComponent },
    { path: 'mochuco', component: MochucoComponent },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: 'item', component: ItemComponent },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
