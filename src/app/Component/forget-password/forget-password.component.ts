import { ForgetPasswordService } from './../../Service/forgetPasswordservice/forget-password.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetform: FormGroup;
  submitted=false;
  email;

  constructor(public formBuilder: FormBuilder,
    private ForgetPasswordService: ForgetPasswordService ) { }

    ngOnInit() {
      this.forgetform = this.formBuilder.group({
        
         email: ['', [Validators.required, Validators.email]]
   
       })
     }
     get f() { return this.forgetform.controls; }
     sendMail() { 
         if (this.forgetform.valid)
          this.ForgetPasswordService.send(this.forgetform.value).subscribe((response: any) => {
            console.log("response",response);
            
          } 
          )}
   
}
