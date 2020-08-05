import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Component/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './Component/signup/signup.component';
import { ForgetPasswordComponent } from './Component/forget-password/forget-password.component';
import { ResetPasswordComponent } from './Component/reset-password/reset-password.component';
import { DashBoardComponent } from './Component/dash-board/dash-board.component';
import { ArchiveComponent } from './Component/archive/archive.component';
import { DeleteNoteComponent } from './Component/delete-note/delete-note.component';
import { RemindersComponent } from './Component/reminders/reminders.component';
import { IconCollectorComponent } from './Component/icon-collector/icon-collector.component';
import {MatTableModule} from '@angular/material/table';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    DashBoardComponent,
    ArchiveComponent,
    DeleteNoteComponent,
    RemindersComponent,
    IconCollectorComponent,


  ],
    imports: [
        BrowserAnimationsModule,
        FlexLayoutModule,
        AppRoutingModule,
        FormsModule,
        MaterialModule,
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatTableModule


    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
