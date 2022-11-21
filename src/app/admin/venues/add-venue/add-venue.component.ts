import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Venue } from 'src/app/shared/models';
import { VenuesService } from '../venues.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-add-venue',
    templateUrl: './add-venue.component.html',
    styleUrls: ['./add-venue.component.scss']
})
export class AddVenueComponent implements OnInit {

    form: FormGroup;
    editmode: boolean = false;
    venueId: string

    constructor(
        // @Inject(MAT_DIALOG_DATA) private data: any,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private venuesService: VenuesService,
        private router: Router) { }

    ngOnInit(): void {
        // console.log(this.data);
        this.initForm()
        const venueId = this.route.snapshot.paramMap.get('venueId')
        const venueName = this.route.snapshot.paramMap.get('venueName')
        console.log(venueId);
        if (venueId) {
            this.venueId = venueId;
            this.editmode = true;
            this.form.patchValue({
                name: venueName
            })
        }
    }
    initForm() {

        this.form = this.fb.group({
            name: new FormControl(null, [Validators.required])
        })
    }
    onSubmit() {
        console.log(this.form.value);
        const venueName = this.form.value.name
        if (this.editmode) {
            this.venuesService.updateVenue(this.venueId, venueName)
                .then(res => {
                    console.log('venue updated')
                    this.router.navigateByUrl('/admin/venues');
                })
                .catch(err => console.log(err))
        } else {
            const venue: Venue = {
                name: venueName
            }
            this.venuesService.addVenue(venue)
                .then(res => {
                    console.log('venue added')
                    this.router.navigateByUrl('/admin/venues');
                })
                .catch(err => console.log(err));
        }
    }
    onCancel() {
        this.router.navigateByUrl('/admin/venues');
    }
}
