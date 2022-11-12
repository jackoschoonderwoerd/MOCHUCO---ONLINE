import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Venue } from 'src/app/shared/models';
import { VenuesService } from '../venues.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add-venue',
    templateUrl: './add-venue.component.html',
    styleUrls: ['./add-venue.component.scss']
})
export class AddVenueComponent implements OnInit {

    form: FormGroup

    constructor(
        private fb: FormBuilder,
        private venuesService: VenuesService,
        private router: Router) { }

    ngOnInit(): void {
        this.initForm()
    }
    initForm() {
        this.form = this.fb.group({
            name: new FormControl(null, [Validators.required])
        })
    }
    onSubmit() {
        console.log(this.form.value);
        const venueName = this.form.value.name
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
