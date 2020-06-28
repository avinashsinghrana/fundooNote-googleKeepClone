import { SignupService } from './../../Service/signup/signup.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  hide = false;
  submitted = false;
  fname: string;
  lname:string;
  mobile;
  email:string;
  password:string;
  service;

  constructor(public formBuilder: FormBuilder,
    private SignupService: SignupService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      service: ['', [Validators.required]]

    })
  }

  get f() { return this.registerForm.controls; }
  signUp() {
    if (this.registerForm.valid)
      this.SignupService.signup(this.registerForm.value).subscribe((response: any) => {
        console.log("response", response);

      }
      )
  }
}
