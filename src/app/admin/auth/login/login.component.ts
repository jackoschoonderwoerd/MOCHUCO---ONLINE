import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MochucoUser } from '../mochuco-user.model';
import { Router } from '@angular/router';

import { Auth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from '@angular/fire/auth'

import { Subject, tap, pipe, map } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form: FormGroup;


    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private afAuth: Auth
    ) { }

    ngOnInit(): void {
        this.initForm();
    }
    initForm() {
        this.form = this.fb.group({
            email: new FormControl('jackoboes@gmail.com', [Validators.required]),
            password: new FormControl('123456', [Validators.required])
        })
    }
    onLogIn() {
        const user: MochucoUser = {
            email: this.form.value.email,
            password: this.form.value.password
        }
        this.authService.logIn(user).subscribe(
            userData => {
                // console.log(userData);
                // console.log(userData.user);
                // console.log(userData.user.stsTokenManager)
                // console.log(userData.user.stsTokenManager.accessToken)
                this.router.navigateByUrl('admin')
                this.afAuth.currentUser.getIdTokenResult()
                    .then((data: any) => {
                        // console.log(data);
                        // console.log(data.user)
                        // console.log(data.claims)
                    })

            });
        // this.afAuth.currentUser.getIdTokenResult()
        //     .then(data => console.log(data))
        //     .catch(err => console.log(err));

    }

}
