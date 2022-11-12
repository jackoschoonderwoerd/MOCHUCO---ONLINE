import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UiService } from '../../shared/ui.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SelectLanguageService } from '../../navigation/footer/select-language/select-language.service';
import { LanguageService } from '../../shared/language.service';

@Component({
    selector: 'app-mochuco',
    templateUrl: './mochuco.component.html',
    styleUrls: ['./mochuco.component.scss']
})
export class MochucoComponent implements OnInit {


    constructor(
        public uiService: UiService,
        private router: Router,
        public selectedLanguageService: SelectLanguageService,
        public languageService: LanguageService
        // private dialogRef: MatDialogRef<MochucoComponent>,
        // private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.languageService.language$.subscribe((language: string) => {
            console.log(language)
        })
        // this.isLoading$ = this.uiService.isLoading$
        // this.uiService.isLoading$.subscribe((status: boolean) => {
        //     console.log(status)
        //     this.isLoading = status;
        // })
    }
    onCloseWindow() {

    }
    onAdminOnly() {
        this.router.navigateByUrl('/admin')
    }

}
