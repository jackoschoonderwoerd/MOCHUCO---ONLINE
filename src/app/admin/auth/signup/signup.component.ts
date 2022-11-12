import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MochucoUser } from '../mochuco-user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.initForm()
  }
  initForm() {
    this.form = this.fb.group({
      email: new FormControl('jackoboes@gmail.com', [Validators.required]),
      password: new FormControl('123456', [Validators.required])
    })
  }
  onSignUp() {
    console.group(this.form.value)
    const user: MochucoUser = {
      email: this.form.value.email,
      password: this.form.value.password
    }
    this.authService.signUp(user)
  }
}
