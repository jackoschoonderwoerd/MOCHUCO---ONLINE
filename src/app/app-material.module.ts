import { NgModule } from "@angular/core";

import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    imports: [
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatToolbarModule,
        MatIconModule,
        MatTooltipModule
    ],
    exports: [
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatToolbarModule,
        MatIconModule,
        MatTooltipModule
    ]
})

export class AppMaterialModule { }
