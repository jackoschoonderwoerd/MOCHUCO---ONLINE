import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/shared/models';
import { ItemService } from './item.service';
import { Observable } from 'rxjs';
import { LanguageService } from 'src/app/shared/language.service';
import { ItemByLanguage, ItemLS } from '../../shared/models';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

    item: Item
    item$: Observable<Item>
    title: string = 'items'
    language$: Observable<string>

    imageUrl: string;
    itemName: string;
    description: string;
    audioUrl: string;
    audioAutoplay: boolean;


    constructor(
        private route: ActivatedRoute,
        public languageService: LanguageService,
        public itemService: ItemService) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe((queryParams: any) => {
            console.log(queryParams);
            this.languageService.language$.subscribe((language: string) => {
                console.log(language)
                const venueId = queryParams.venueId
                const itemId = queryParams.itemId
                if (venueId && itemId) {
                    this.itemService.getItem(venueId, itemId).subscribe((item: Item) => {
                        this.getAvailableLanguages(item)
                        this.imageUrl = item.imageUrl
                        const itemByLanguageArray: ItemByLanguage[] = item.itemsByLanguage.filter((itemByLanguage: ItemByLanguage) => {
                            return itemByLanguage.language === language
                        })
                        const itemByLanguage: ItemByLanguage = itemByLanguageArray[0]
                        this.itemName = itemByLanguage.itemLS.name;
                        this.description = itemByLanguage.itemLS.description;
                        this.audioUrl = itemByLanguage.itemLS.audioUrl;
                        this.audioAutoplay = itemByLanguage.itemLS.audioAutoplay

                    })
                } else {
                    this.itemService.setMainPage()
                }
            })
        })
    }
    getAvailableLanguages(item: Item) {
        console.log(item);
        const languages: string[] = [];
        item.itemsByLanguage.forEach((itemByLanguage: ItemByLanguage) => {
            languages.push(itemByLanguage.language)
            this.languageService.setAvailableLanguages(languages)
        })
    }
}
