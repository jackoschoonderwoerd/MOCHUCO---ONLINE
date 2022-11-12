import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MochucoUser } from '../mochuco-user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.initForm()
  }
  initForm() {
    this.form = this.fb.group({
      email: new FormControl('jackoboes@gmail.com', [Validators.required]),
      password: new FormControl('123456', [Validators.required])
    })
  }
  onLogIn() {
    console.group(this.form.value)
    const user: MochucoUser = {
      email: this.form.value.email,
      password: this.form.value.password
    }
    this.authService.logIn(user).subscribe(
      user => {
        console.log(user)
        this.router.navigateByUrl('admin')
      });
  }

}
