import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {LoginService} from '../../Service/loginService/login.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgForm} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SignupComponent} from '../signup/signup.component';
import {crudHttpsCallWithToken, getHttpsCall} from '../utils/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = false;
  submitted = false;
  email;
  password;
  login: FormGroup;

  constructor(public formBuilder: FormBuilder,
              private loginService: LoginService,
              private router: Router,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<LoginComponent>,
  ) {
  }


  ngOnInit() {
    this.login = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]

    });
  }

  get f() {
    return this.login.controls;
  }

  Login() {
    if (this.login.valid) {
      const res$ = crudHttpsCallWithToken('/user/login', this.login.value, 'post');
      res$.subscribe((response : any) => {
        console.log('response', response);
        localStorage.setItem('token', response.id);
        localStorage.setItem('fullName', response.firstName + ' ' + response.lastName);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('email', response.email);
        this.dialogRef.close();
        this.snackBar.open(
          'Login Successfully',
          response.firstName,
          {duration: 2000}
        );
        location.reload();
      });
    }
  }
}
