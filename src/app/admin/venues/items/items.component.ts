import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ConfirmDeleteComponent } from 'src/app/shared/confirm-delete/confirm-delete.component';
import { Item, ItemByLanguage, Venue } from '../../../shared/models';
import { VenuesService } from '../venues.service';
import { ItemDetailsService } from './item-details/item-details.service';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { ItemImageComponent } from './add-item/item-image/item-image.component';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { ItemsService } from './items.service';
import { DeleteItemDialogComponent } from './delete-item-dialog/delete-item-dialog.component';


@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {


    venue$: Observable<Venue>;
    venueName: string;
    venueId: string;
    audioPlaying: boolean = false;
    audio;
    venue: Venue;
    items$: Observable<Item[]>


    constructor(
        private route: ActivatedRoute,
        private venuesService: VenuesService,
        private router: Router,
        private dialog: MatDialog,
        private itemDetailsService: ItemDetailsService,
        private itemsService: ItemsService
    ) { }

    ngOnInit(): void {
        console.log('onInit')
        this.route.params.subscribe((params: any) => {
            this.venueName = params.venueName;
            this.venueId = params.venueId

            this.items$ = this.itemsService.getItems(this.venueId);
            this.venue$ = this.venuesService.getVenueById(this.venueId);

            this.venuesService.getVenueById(this.venueId).subscribe((venue: Venue) => {
                this.venue = venue
            })
        });
    }
    onDelete(itemId: string) {
        const dialogRef = this.dialog.open(DeleteItemDialogComponent);
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.itemsService.deleteItem(this.venueId, itemId)
                    .then(res => {
                        console.log('item deleted')

                    })
                    .catch(err => console.log(err));
            }
        })
    }
    onQrCode(itemId: string, itemName: string) {
        this.dialog.open(QrCodeComponent, {
            data: {
                venueId: this.venueId,
                itemId,
                itemName,
                local: false
            }
        })
    }
    onQrCodeLocal(itemId, itemName) {
        this.dialog.open(QrCodeComponent, {
            data: {
                venueId: this.venueId,
                itemId,
                itemName,
                local: true
            }
        })
    }
    onEdit(itemId: string) {
        // this.venuesService.setActiveItem(this.venueId, itemId)
        console.log(itemId)
        this.router.navigate(['/admin/add-item', { venueId: this.venue.id, itemId: itemId }])
    }

    onLanguages(item) {
        // this.itemsService.setActiveItem(item)
        this.router.navigate(['/admin/languages', { venueId: this.venueId, itemId: item.id, itemName: item.name }])
    }

    // deleteAllDataInStorage() {
    //     this.itemDetailsService.deleteAllDataFromStorage(this.venue.id)
    //         .then(res => console.log('all venuedata removed from storage'))
    //         .catch(err => console.error(err));
    // }

    checkForAudioStorage(itemIndex: number, languageIndex: number, language: string) {
        const itemId = this.venue.items[itemIndex].id
        if (this.venue.items[itemIndex].itemsByLanguage[languageIndex].itemLS.audioUrl) {
            console.log('audio found')
            this.itemDetailsService.deleteAudio(this.venue.id, itemId, language)
                .then((res) => console.log('audio deleted'))
                .catch(err => console.error(err))
        } else {
            console.log('no audio found')
        }
    }
    async onAudioClicked(itemId: string, audioUrl: string, myIndex: number) {

        const id = '#id' + itemId + '-' + myIndex.toString();
        const targets = document.querySelectorAll(id)
        targets[0].innerHTML = 'pause'
        if (!this.audioPlaying) {
            this.audioPlaying = true;
            this.audio = new Audio(audioUrl);
            try {
                await this.audio.play();
                console.log('Playing...');
            } catch (err) {
                console.log('Failed to play...' + err);
            }
        } else {
            const icons = document.querySelectorAll('mat-icon')
            console.log(icons)
            icons.forEach(icon => {
                if (icon.innerHTML === 'pause') {
                    icon.innerHTML = 'play_arrow'
                }
            })
            this.audio.pause()
            this.audioPlaying = false;
        }
    }
    // onImage(imageUrl) {
    //     this.dialog.open(ItemImageComponent, { data: { imageUrl } })
    // }
    onImage(imageUrl: string) {
        if (imageUrl) {
            this.dialog.open(ImageDialogComponent, {
                data: { imageUrl }
            })
        }
    }

    onAddItem() {
        this.router.navigate(
            [
                '/admin/add-item',
                {
                    venueId: this.venueId,
                    venueName: this.venueName
                }
            ]
        )
    }
    onAddLanguage(itemId: string) {
        this.router.navigate(
            [
                '/admin/item-details',
                {
                    action: 'add-language',
                    itemId,
                    // item: JSON.stringify(item),
                }
            ]

        )
    }

    onEditItemByLanguage(itemId: string, language: string) {
        console.log(itemId, language)
        this.router.navigate(
            [
                '/admin/item-details',
                {
                    action: 'edit-item-by-language',
                    itemId,
                    language: language,
                }
            ])
    }

    onVenues() {
        this.router.navigateByUrl('/admin/venues');
    }
}
