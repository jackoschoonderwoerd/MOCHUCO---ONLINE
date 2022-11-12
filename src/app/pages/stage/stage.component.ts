import { Component, OnInit } from '@angular/core';

import { UiService } from '../../shared/ui.service';
import { SelectLanguageService } from '../../navigation/footer/select-language/select-language.service';

@Component({
    selector: 'app-stage',
    templateUrl: './stage.component.html',
    styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit {

    constructor(

        public uiService: UiService,
        public selectedLanguageService: SelectLanguageService
    ) { }

    ngOnInit(): void {
    }

}
