import { ResetpasswordService } from './../../Service/resetPasswordService/resetpassword.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetform: FormGroup;
  hide=false;
  submitted=false;

  constructor(public formBuilder: FormBuilder,
    private ResetpasswordService: ResetpasswordService ) { }

    ngOnInit() {
      this.resetform = this.formBuilder.group({
        
         password: ['', [Validators.required, Validators.minLength(8)]]
   
       })
     }
     get f() { return this.resetform.controls; }
  reset(){

  }
}
