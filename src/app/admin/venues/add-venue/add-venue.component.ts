import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Venue } from 'src/app/shared/models';
import { VenuesService } from '../venues.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PermissionDeniedDialogComponent } from '../../shared/permission-denied-dialog/permission-denied-dialog.component';
import { Auth } from '@angular/fire/auth';
import { WarningComponent } from '../../../shared/warning/warning.component';
import { ConfirmDeleteComponent } from '../../../shared/confirm-delete/confirm-delete.component';

@Component({
    selector: 'app-add-venue',
    templateUrl: './add-venue.component.html',
    styleUrls: ['./add-venue.component.scss']
})
export class AddVenueComponent implements OnInit {

    form: FormGroup;
    editmode: boolean = false;
    venueId: string;
    venueName: string;
    logoSrc: any;
    logoUrl: string = null
    imageFile: File;
    isStoringLogo: boolean = false;
    logoChanged: boolean = false;
    formChanged: boolean = false;

    constructor(
        // @Inject(MAT_DIALOG_DATA) private data: any,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private dialog: MatDialog,
        // private dialogRef: MatDialogRef<WarningComponent>,
        private venuesService: VenuesService,
        private router: Router,
        private auth: Auth) { }

    ngOnInit(): void {

        this.initForm()
        this.venueId = this.route.snapshot.paramMap.get('venueId')
        this.venueName = this.route.snapshot.paramMap.get('venueName')
        console.log(this.venueId);

        if (this.venueId) {
            this.editmode = true;
            this.venuesService.getVenueById(this.venueId)
                .subscribe((venue: Venue) => {
                    console.log(venue);
                    this.form.patchValue({
                        name: venue.name
                    })
                    this.logoUrl = venue.logoUrl
                })
        }
    }
    initForm() {
        this.form = this.fb.group({
            name: new FormControl(null, [Validators.required])
        })
    }
    onFormChanged() {
        this.formChanged = true;
    }
    onFileInputChange(e) {
        if (this.logoSrc) {
            this.logoSrc = null;
        }
        if (this.logoUrl) {
            this.logoUrl = null;
        }
        this.logoChanged = true;
        console.log(e.target.files[0]);
        const filename = e.target.files[0].name;
        const ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        if (ext !== 'jpg' && ext !== 'png' && ext !== 'jpeg' && ext !== 'webp') {
            this.dialog.open(WarningComponent, { data: { message: 'wrong filetype, only files with a name ending on \'jpg\' or \'png\' or \'webp\' are allowed' } })
            // this.dialogRef.close()
        } else {
            console.log
            var fileReader = new FileReader();
            this.imageFile = e.target.files[0]
            fileReader.readAsDataURL(this.imageFile)
            fileReader.onload = () => {
                this.logoSrc = fileReader.result;

            }
        }
    }

    onConfirmLogo() {
        this.isStoringLogo = true
        this.logoSrc = null;
        if (this.imageFile) {
            this.venuesService.storeLogo(this.venueId, this.imageFile)
                .then((logoUrl: string) => {
                    this.logoChanged = false;
                    this.isStoringLogo = false;
                    this.formChanged = true;
                    console.log(logoUrl);
                    this.logoUrl = logoUrl
                })
        }
    }
    onDeleteLogo(logoSrc: string, logoUrl: string) {
        // console.log(logoSrc, logoUrl)
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, { data: { message: 'this will permanently remove the logo' } })
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                console.log('No res, logo not deleted')
                return
            } else {
                if (!logoUrl) {
                    this.logoSrc = null;
                    console.log('No url, logoSrc set to null')
                    return;
                } else {
                    this.venuesService.removeLogoFromStorage(this.venueId)
                        .then((res) => {
                            console.log('Logo removed from storage')
                            this.venuesService.removeLogoUrlFromDb(this.venueId)
                                .then(res => {
                                    console.log('LogoUrl removed from DB');
                                })
                        })
                }
            }
        })

        // this.venuesService.removeLogoFromStorage()
    }
    onSubmit() {
        console.log(this.form.value);
        console.log('USER ID:', this.auth.currentUser.uid);

        const venueName = this.form.value.name
        if (this.editmode) {
            this.venuesService.updateVenue(this.venueId, venueName, this.logoUrl)

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
                owner: this.auth.currentUser.uid,
                logoUrl: this.logoUrl

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
