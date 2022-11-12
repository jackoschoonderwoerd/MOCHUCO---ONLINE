import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item, ItemByLanguage } from '../../../../../shared/models';
import { VenuesService } from '../../../venues.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../../../../../shared/confirm-delete/confirm-delete.component';

@Component({
    selector: 'app-languages',
    templateUrl: './languages.component.html',
    styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {


    venueId: string;
    itemId: string;
    item: Item;
    itemName: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private venuesService: VenuesService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        console.log('onInit')
        this.route.params.subscribe((params: any) => {
            console.log(params);
            this.venueId = params.venueId;
            this.itemId = params.itemId;
            this.itemName = params.itemName;
            this.venuesService.getItem(this.venueId, this.itemId).subscribe((item: Item) => {
                this.item = item;
            })
        })
    }
    onDelete(language) {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, { data: { message: 'this will permanently delete this item' } })
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.item.itemsByLanguage = this.item.itemsByLanguage.filter((itemByLanguage: ItemByLanguage) => {
                    return itemByLanguage.language !== language
                })
                this.venuesService.updateItem(this.venueId, this.itemId, this.item)
                    .then((res) => { console.log('item deleted') })
                    .catch(err => console.log(err));
            }
            return;
        })
    }

    onEdit(itemByLanguage: ItemByLanguage) {
        console.log(itemByLanguage)
        this.venuesService.editItemByLanguage(itemByLanguage)
        this.router.navigate(['/admin/add-language', {
            venueId: this.venueId,
            itemId: this.itemId
        }])

    }
    onAddLanguage() {
        this.router.navigate(['/admin/add-language', {
            venueId: this.venueId,
            itemId: this.itemId,

        }])
    }
    onItems() {
        this.router.navigate(['/admin/items', {
            venueId: this.venueId
        }])
    }
    onVenues() {
        this.router.navigateByUrl('/admin/venues');
    }

}
