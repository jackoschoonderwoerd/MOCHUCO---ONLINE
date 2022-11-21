import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Venue } from 'src/app/shared/models';
import { VenuesService } from './venues.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../../shared/confirm-delete/confirm-delete.component';
import { AddVenueComponent } from './add-venue/add-venue.component';
import { Item } from '../../shared/models';
import { DeleteVenueDialogComponent } from './delete-venue-dialog/delete-venue-dialog.component';


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

    ) { }

    ngOnInit(): void {
        this.venues$ = this.venuesService.getVenues()
    }
    onEditVenue(venueId: string, venueName: string) {
        this.router.navigate(['/admin/add-venue', { venueId, venueName }])
    }

    onDelete(venueId) {
        const dialogRef = this.dialog.open(DeleteVenueDialogComponent);
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.venuesService.deleteVenueStorage(venueId)
                    .then(res => {
                        console.log('venue storage deleted', res);
                    })
                    .catch(err => console.log(err))

                // this.venuesService.getItems(venueId).subscribe((items: Item[]) => {
                //     console.log(items);
                //     items.forEach((item: Item) => {
                //         this.venuesService.deleteItem(venueId, item.id)
                //             .then((res) => {
                //                 console.
                //                     log('item deleted', item.id)
                //             })
                //             .then(() => {
                //                 this.venuesService.deleteVenue(venueId)
                //                     .then((res) => console.log('venue deleted', venueId))
                //                     .catch(err => console.log(err));

                //             })
                //             .catch(err => console.log(err));
                //     })
                // })
            }
        })
    }

    onItems(venue: Venue) {
        // this.venuesService.setActiveVenue(venue);
        localStorage.setItem('activeVenue', JSON.stringify(venue));
        this.router.navigate(['admin/items', { venueId: venue.id, venueName: venue.name }])
    }


    onAddVenue() {
        this.router.navigateByUrl('/admin/add-venue')
    }
}
