import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ItemImageComponent } from './item-image/item-image.component';
import { Item } from 'src/app/shared/models';
import { VenuesService } from '../../venues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Venue } from '../../../../shared/models';

@Component({
    selector: 'app-add-item',
    templateUrl: './add-item.component.html',
    styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {

    form: FormGroup;
    imageUrl: string = null;
    venueId: string;
    venue: Venue
    venueName: string;
    itemId: string
    editmode: boolean = false;
    item: Item;
    mainPage: boolean = false


    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private venuesService: VenuesService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit(): void {
        this.initForm()
        this.route.params.subscribe((params: any) => {
            this.venueId = params.venueId;
            this.venueName = params.venueName;
            if (params.itemId) {
                this.itemId = params.itemId
                this.editmode = true
                this.venuesService.getItem(this.venueId, params.itemId).subscribe((item: Item) => {
                    this.item = item
                    this.form.patchValue({
                        name: item.name
                    })
                    this.imageUrl = item.imageUrl
                })
            }

        })
    }
    initForm() {
        this.form = this.fb.group({
            name: new FormControl(null, [Validators.required]),
            isMainPage: new FormControl(null, [Validators.required])
        })
    }


    onImage() {
        console.log(this.item.imageUrl)
        const dialogRef = this.dialog.open(ItemImageComponent, {
            data: {
                venueId: this.venueId,
                itemId: this.itemId,
                imageUrl: this.item.imageUrl
            },
            maxHeight: '80vh'
        })
        dialogRef.afterClosed().subscribe((imageUrl: string) => {
            if (imageUrl) {
                this.imageUrl = imageUrl
            }
            return;

        })
    }
    onSubmit() {
        const item: Item = {
            name: this.form.value.name,
            imageUrl: this.imageUrl,
            isMainPage: this.form.value.isMainPage,

        }
        if (!this.editmode) {
            console.log('ADDING ITEM: ', item)
            this.venuesService.addItemToVenue(this.venueId, item)
                .then(res => {
                    console.log('item added!')
                    this.router.navigate(['/admin/items', { venueId: this.venueId, venueName: this.venueName }])
                })
                .catch(err => console.log(err));
        } else {
            console.log('UPDATING ITEM: ', item)
            if (this.item.itemsByLanguage) {
                item.itemsByLanguage = this.item.itemsByLanguage
            } else {
                item.itemsByLanguage = [];
            }
            this.venuesService.updateItem(this.venueId, this.itemId, item)
                .then((res) => {
                    console.log('item updated')
                    this.router.navigate(['/admin/items', { venueId: this.venueId, venueName: this.venueName }])
                })
                .catch(err => console.log(err));
        }
    }
    onVenues() {
        this.router.navigateByUrl('/admin/venues')
    }
    onItems() {
        this.router.navigate(['/admin/items', { venueId: this.venueId, itenId: this.itemId }])
    }
}
