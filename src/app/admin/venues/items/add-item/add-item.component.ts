import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ItemImageComponent } from './item-image/item-image.component';
import { Item } from 'src/app/shared/models';
import { VenuesService } from '../../venues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Venue } from '../../../../shared/models';
import { ItemsService } from '../items.service';
import { PermissionDeniedDialogComponent } from '../../../shared/permission-denied-dialog/permission-denied-dialog.component';
import { GeneralStoreService } from 'src/app/shared/general-store.service';
import { ConfirmDeleteComponent } from '../../../../shared/confirm-delete/confirm-delete.component';

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
    mainPage: boolean = false;
    unsaved: boolean = false;


    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private venuesService: VenuesService,
        private itemsService: ItemsService,
        private route: ActivatedRoute,
        private router: Router,
        public generalStore: GeneralStoreService) { }

    ngOnInit(): void {
        this.initForm()
        this.route.params.subscribe((params: any) => {
            this.venueId = params.venueId;
            this.venueName = params.venueName;
            if (params && params.itemId) {
                this.itemId = params.itemId
                this.editmode = true
                this.itemsService.getItem(this.venueId, params.itemId).subscribe((item: Item) => {
                    this.item = item
                    this.form.patchValue({
                        name: item.name,
                        latitude: item.latitude,
                        longitude: item.longitude,
                        isMainPage: item.isMainPage
                    })
                    this.imageUrl = item.imageUrl
                })
            }

        })
    }
    initForm() {
        this.form = this.fb.group({
            name: new FormControl(null, [Validators.required]),
            isMainPage: new FormControl(null, [Validators.required]),
            latitude: new FormControl(null),
            longitude: new FormControl(null)
        })
    }


    onImage() {

        console.log(this.item)
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
                this.unsaved = true;
                this.imageUrl = imageUrl
            }
            return;

        })

    }
    onNameChanged() {
        this.unsaved = true;
    }

    onSubmit() {
        let latitude = null;
        if (this.form.value.latitude) {
            latitude = this.form.value.latitude;
        }
        let longitude = null;
        if (this.form.value.longitude) {
            longitude = this.form.value.longitude;
        }
        const item: Item = {
            name: this.form.value.name.toLowerCase(),
            imageUrl: this.imageUrl,
            isMainPage: this.form.value.isMainPage,
            latitude: latitude,
            longitude: longitude
        }
        console.log(item);
        // return;
        if (!this.editmode) {
            console.log('ADDING ITEM: ', item)

            this.itemsService.addItemToVenue(this.venueId, item)
                .then(docRef => {
                    console.log('item added!', docRef.id)
                    // if (item.latitude !== null && item.longitude !== null) {
                    this.itemsService.setLocationAndIdToVenues(
                        this.venueId,
                        docRef.id,
                        this.form.value.name,
                        item.latitude,
                        item.longitude
                    ).then((docRef) => {
                        console.log(docRef => {
                            console.log('location added')
                        })
                    });
                    // }
                    this.router.navigate(['/admin/items', { venueId: this.venueId, venueName: this.venueName }]);
                    this.generalStore.setAction('overview items');
                    this.generalStore.setActiveItem(null, null);
                })
                .catch(err => console.log(err));
        } else {
            console.log('UPDATING ITEM: ', item)
            if (this.item.itemsByLanguage) {
                item.itemsByLanguage = this.item.itemsByLanguage
            } else {
                item.itemsByLanguage = [];
            }
            this.itemsService.setItem(this.venueId, this.itemId, item)
                .then((docRef) => {
                    console.log('item updated')
                    // if (item.latitude !== null && item.longitude !== null) {
                    this.itemsService.setLocationAndIdToVenues(
                        this.venueId,
                        this.itemId,
                        item.name,
                        item.latitude,
                        item.longitude)
                        .then((docRef) => {
                            console.log('location updated')
                        });
                    // }
                    this.router.navigate(['/admin/items', { venueId: this.venueId, venueName: this.venueName }])
                    this.generalStore.setAction('overview items');
                    this.generalStore.setActiveItem(null, null);
                })
                .catch(err => {
                    console.log(err)
                    this.dialog.open(PermissionDeniedDialogComponent, { data: { err } })
                });
        }
        this.unsaved = false;
    }
    onVenues() {
        this.router.navigateByUrl('/admin/venues')
    }
    onItems() {
        this.router.navigate(['/admin/items', { venueId: this.venueId, itenId: this.itemId }])
    }

    onCancel() {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, { data: { message: 'all your edits will be lost' } });
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.router.navigate(['/admin/items', { venueId: this.venueId }])
                this.generalStore.setActiveItem(null, null);
                this.generalStore.setAction('overview items')
            }
            return;
        })
    }
}
// ,52.36726536641987 4.889799268167798
