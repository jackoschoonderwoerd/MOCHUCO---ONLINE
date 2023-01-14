import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MochucoUser } from '../mochuco-user.model';
import { Router, ActivatedRoute } from '@angular/router';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setPersistence,
    browserSessionPersistence,
    user,
    User,
    getAuth
} from '@angular/fire/auth';
// import { Auth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from '@angular/fire/auth'

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
        private afAuth: Auth,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const action = this.route.snapshot.paramMap.get('action')
        console.log(action)
        if (this.route.snapshot.paramMap.get('action') === 'logout') {
            this.authService.logout();
        }
        this.initForm();
    }

    initForm() {
        this.form = this.fb.group({
            email: new FormControl('jackoboes@gmail.com', [Validators.required]),
            password: new FormControl('123456', [Validators.required])
        })
    }
    onLogIn() {

        const now = new Date()
        const mochucoUser: MochucoUser = {
            email: this.form.value.email,
            password: this.form.value.password,
        }
        this.authService.logIn(mochucoUser).subscribe(
            userData => {
                this.router.navigateByUrl('admin/venues')
            });
    }

}
