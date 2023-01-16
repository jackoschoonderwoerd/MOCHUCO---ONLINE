import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UiService } from '../../shared/ui.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SelectLanguageService } from '../../navigation/footer/select-language/select-language.service';
import { LanguageService } from '../../shared/language.service';
import { AuthService } from '../../admin/auth/auth.service';
import { WarningComponent } from 'src/app/shared/warning/warning.component';
import { Auth } from '@angular/fire/auth'

@Component({
    selector: 'app-mochuco',
    templateUrl: './mochuco.component.html',
    styleUrls: ['./mochuco.component.scss']
})
export class MochucoComponent implements OnInit {

    definedLanguages: string[] = ['dutch', 'english', 'french']
    constructor(
        public uiService: UiService,
        private router: Router,
        public selectedLanguageService: SelectLanguageService,
        public languageService: LanguageService,
        public authService: AuthService,
        private dialog: MatDialog,
        public afAuth: Auth
        // private dialogRef: MatDialogRef<MochucoComponent>,
        // private dialog: MatDialog
    ) { }

    ngOnInit(): void {

        this.languageService.language$.subscribe((language: string) => {
            console.log(language);
            if (!this.definedLanguages.includes(language)) {
                this.languageService.setLanguage('dutch');
            }
            this.languageService.setAvailableLanguages(this.definedLanguages)
        })
    }
    onCloseWindow() {

    }
    onClose() {
        window.history.back();
    }
    onLogin() {
        if (window.innerWidth < 1000) {
            const message = 'You can not log in, You need a screen at least 1000px wide to use the admin section of the Mochuco app.'
            this.dialog.open(WarningComponent, { data: { message } })
        } else {
            this.router.navigateByUrl('/admin/login')
        }
    }

}
