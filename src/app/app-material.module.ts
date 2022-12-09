import { NgModule } from "@angular/core";

import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
    imports: [
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatToolbarModule,
        MatIconModule,
        MatTooltipModule,
        MatExpansionModule
    ],
    exports: [
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatToolbarModule,
        MatIconModule,
        MatTooltipModule,
        MatExpansionModule
    ]
})

export class AppMaterialModule { }
