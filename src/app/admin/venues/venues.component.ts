import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Venue } from 'src/app/shared/models';
import { VenuesService } from './venues.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../../shared/confirm-delete/confirm-delete.component';

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
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.venues$ = this.venuesService.getVenues()
    }

    onDelete(venueId) {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, { data: { message: 'this will premanently remove the venue, including all it\'s items, images and audiofragments from the database' } });
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.venuesService.deleteVenue(venueId)
                    .then(res => {
                        console.log('venue deleted')
                    })
                    .catch(err => console.log(err));
            }
        })
    }

    onItems(venue: Venue) {
        this.venuesService.setActiveVenue(venue);
        localStorage.setItem('activeVenue', JSON.stringify(venue));
        this.router.navigate(['admin/items', { venueId: venue.id, venueName: venue.name }])
    }


    onAddVenue() {
        this.router.navigateByUrl('/admin/add-venue')
    }
}
