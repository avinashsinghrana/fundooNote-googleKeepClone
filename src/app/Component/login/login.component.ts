import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoginService } from '../../Service/loginService/login.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

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
    private snackBar: MatSnackBar
  ) { }


  ngOnInit() {
    this.login = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]

    })
  }

  get f() { return this.login.controls; }
  Login() {
    if (this.login.valid)
      this.loginService.login(this.login.value).subscribe((response: any) => {
        console.log("response", response);
        /*  localStorage.setItem("token", response.token);
         localStorage.setItem("fullName", response.data.firstName + " " + response.data.lastName);
         localStorage.setItem("email", response.data.email);
         this.snackBar.open(
           "Login Successfully",
           "undo",
           { duration: 2000 }
         )
         setTimeout(() => {
           this.router.navigate(['u/0/home'])
         },
           3000);
 
       }, error => {
         this.snackBar.open(
           "Login Failed",
           "undo",
           { duration: 2000 }
         )
       });
     else {
       this.login.controls['email'].markAsTouched()
     }
  */
      }
      )
  }
}

