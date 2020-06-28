import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "../app/Component/login/login.component"
import { SignupComponent } from "../app/Component/signup/signup.component"
import { ForgetPasswordComponent } from './Component/forget-password/forget-password.component';
import { ResetPasswordComponent } from './Component/reset-password/reset-password.component';
import{ DashBoardComponent } from './Component/dash-board/dash-board.component';
import { ArchiveComponent } from './Component/archive/archive.component';
import { DeleteNoteComponent } from './Component/delete-note/delete-note.component';
import { RemindersComponent } from './Component/reminders/reminders.component';
import { IconCollectorComponent } from './Component/icon-collector/icon-collector.component';


const routes: Routes = [
  { path: '', component: SignupComponent },
  {path: 'signup', component: SignupComponent},
{ path: 'login', component: LoginComponent },
 { path: 'forget-password', component: ForgetPasswordComponent},
 { path: 'reset-password', component: ResetPasswordComponent},
 { path: 'dash-board' , component: DashBoardComponent},
 { path: 'archive' , component: ArchiveComponent},
 { path: 'delete-note' , component: DeleteNoteComponent},
 { path: 'reminders' , component: RemindersComponent},
{ path: 'icon-collector', component: IconCollectorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
