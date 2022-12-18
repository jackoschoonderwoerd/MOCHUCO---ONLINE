import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, filter, of } from 'rxjs';
import { Venue } from 'src/app/shared/models';
import { VenuesService } from './venues.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../../shared/confirm-delete/confirm-delete.component';
import { AddVenueComponent } from './add-venue/add-venue.component';
import { Item } from '../../shared/models';
import { DeleteVenueDialogComponent } from './delete-venue-dialog/delete-venue-dialog.component';
import { ItemsService } from './items/items.service';
import { VenueQrCodeComponent } from './venue-qr-code/venue-qr-code.component';
import { AuthService } from '../auth/auth.service';



@Component({
    selector: 'app-venues',
    templateUrl: './venues.component.html',
    styleUrls: ['./venues.component.scss']
})
export class VenuesComponent implements OnInit {

    venues$: Observable<Venue[]>

    constructor(
        private router: Router,
        private venuesService: VenuesService,
        private dialog: MatDialog,
        private itemsService: ItemsService,
        public authService: AuthService
    ) { }

    ngOnInit(): void {
        this.venues$ = this.venuesService.getVenues();
    }
    onQrCode(venueId: string, venueName: string) {
        this.dialog.open(VenueQrCodeComponent, { data: { venueId, venueName } })
    }
    onEditVenue(venueId: string, venueName: string) {
        this.router.navigate(['/admin/add-venue', { venueId, venueName }])
    }

    onDelete(venueId) {
        const dialogRef = this.dialog.open(DeleteVenueDialogComponent);
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.itemsService.getItems(venueId).subscribe((items: Item[]) => {
                    console.log(items);
                    if (items.length > 0) {
                        items.forEach((item: Item) => {
                            this.itemsService.deleteItem(venueId, item.id)
                                .then((res) => {
                                    console.
                                        log('item deleted', item.id)
                                })
                                .then(() => {
                                    this.venuesService.deleteVenue(venueId)
                                        .then((res) => console.log('venue deleted after items deleted', venueId))
                                        .catch(err => console.log(err));

                                })
                                .catch(err => console.log(err));
                        })
                    } else {
                        this.venuesService.deleteVenue(venueId)
                            .then((res) => {
                                console.log('venue without items deleted', venueId)
                                // TODO remove venueid from users/coursesowned
                                this.venuesService.removeVenueIdFromCoursesOwned(venueId)
                                    .then((res) => { console.log('venueId removed from venuesOwned') })
                                    .catch(err => console.log(err))
                            })
                            .catch(err => console.log(err));
                    }
                })
            }
            return;
        })
    }

    onItems(venue: Venue) {
        this.venuesService.setActiveVenue(venue.id);
        // localStorage.setItem('activeVenue', JSON.stringify(venue));
        this.router.navigate(['admin/items', { venueId: venue.id, venueName: venue.name }])
    }


    onAddVenue() {
        this.router.navigateByUrl('/admin/add-venue')
    }
}
