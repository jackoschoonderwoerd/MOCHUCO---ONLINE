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
import { AuthService } from '../../auth/auth.service';
import { GeneralStoreService } from '../../../shared/general-store.service';


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
    remoteLink: string


    constructor(
        private route: ActivatedRoute,
        private venuesService: VenuesService,
        private router: Router,
        private dialog: MatDialog,
        private itemDetailsService: ItemDetailsService,
        private itemsService: ItemsService,
        public authService: AuthService,
        private generalStore: GeneralStoreService
    ) { }

    ngOnInit(): void {
        console.log('onInit')
        this.route.params.subscribe((params: any) => {
            console.log(params);
            this.venueName = params.venueName;
            this.venueId = params.venueId

            this.items$ = this.itemsService.getItems(this.venueId)
                .pipe(
                    map((items: Item[]) => {
                        const isMainPageIndex = items.findIndex((item: Item) => {
                            return item.isMainPage
                        })

                        items.unshift(items[isMainPageIndex])
                        items.splice(isMainPageIndex + 1, 1)


                        return items
                    })
                )
            this.venue$ = this.venuesService.getVenueById(this.venueId);
            this.generalStore.setActiveVenue(this.venueId);

            this.venuesService.getVenueById(this.venueId).subscribe((venue: Venue) => {
                console.log(venue)
                this.venue = venue
            })
        });
    }
    onRemoteLink(itemId: string) {
        this.remoteLink = `https://mochuco-online-3995f.web.app/item?itemId=${itemId}&venueId=${this.venueId}`
        window.open(this.remoteLink, '_blank')
        // https://mochuco-a185b.web.app/mochuco?objectId=CImvrS0TXJXJ9kQohnot&venueId=tFCnVjWeMRTLFjhONWJw
    }
    // https://mochuco-online3995f.web.app/item?itemId=NEkWCVvStpdfp0jBssIC&venueId=PCj7rgcRCNxXCCm9NiFk

    // https://mochuco-online-3995f.web.app/item?venueId=tFCnVjWeMRTLFjhONWJw&itemId=IfYdgKoKOBgEBsnHkkqr

    onDelete(itemId: string) {
        const dialogRef = this.dialog.open(DeleteItemDialogComponent);
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.itemsService.deleteItem(this.venueId, itemId)
                    .then(res => {
                        console.log('item deleted');
                        this.itemsService.deleteLocation(this.venueId, itemId)
                            .then(res => console.log('location deleted'))
                            .catch(err => console.error(err));

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
    onEdit(item: Item) {
        this.generalStore.setActiveItem(this.venueId, item.id)
        this.generalStore.setAction('editing item')
        this.router.navigate(['/admin/add-item', { venueId: this.venue.id, itemId: item.id }])
    }

    onLanguages(item) {
        this.generalStore.setActiveItem(this.venueId, item.id)
        this.generalStore.setAction('overview languages')
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
        this.generalStore.setAction('adding item')
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
        this.generalStore.setActiveLanguage(language);
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
