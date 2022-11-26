import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Venue } from 'src/app/shared/models';
import { VenuesService } from '../venues.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PermissionDeniedDialogComponent } from '../../shared/permission-denied-dialog/permission-denied-dialog.component';
import { Auth } from '@angular/fire/auth';

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
        private dialog: MatDialog,
        private venuesService: VenuesService,
        private router: Router,
        private auth: Auth) { }

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
        console.log('USER ID:', this.auth.currentUser.uid);
        const venueName = this.form.value.name
        if (this.editmode) {
            this.venuesService.updateVenue(this.venueId, venueName)

                .then(res => {
                    console.log('venue updated')
                    this.router.navigateByUrl('/admin/venues');
                })
                .catch(err => {
                    console.log(err)
                    this.dialog.open(PermissionDeniedDialogComponent, { data: { err } })
                })
        } else {
            const venue: Venue = {
                name: venueName,
                owner: this.auth.currentUser.uid

            }
            this.venuesService.addVenue(venue)
                .then(docRef => {
                    console.log('venue added', docRef.id)
                    this.venuesService.updateUser(docRef.id)
                        .then((res) => {
                            console.log('user updated');
                        })
                    // .then(() => {
                    //     this.venuesService.updateAdmin(docRef.id)
                    //         .then(() => {
                    //             console.log('admin updated')
                    //         })
                    //         .catch(err => console.log(err));
                    // })

                    // .then((res) => console.log('user updated', res))
                    // .catch(err => console.log(err));
                    this.router.navigateByUrl('/admin/venues');
                })
                .catch(err => console.log(err));
        }
    }
    onCancel() {
        this.router.navigateByUrl('/admin/venues');
    }
}
