import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { SignupComponent } from './Component/signup/signup.component';
import { ForgetPasswordComponent } from './Component/forget-password/forget-password.component';
import { ResetPasswordComponent } from './Component/reset-password/reset-password.component';
import { DashBoardComponent } from './Component/dash-board/dash-board.component';
import { ArchiveComponent } from './Component/archive/archive.component';
import { DeleteNoteComponent } from './Component/delete-note/delete-note.component';
import { RemindersComponent } from './Component/reminders/reminders.component';
import { IconCollectorComponent } from './Component/icon-collector/icon-collector.component';
import {CreateNoteComponent} from './Component/create-note/create-note.component';
import {ShowLabelNoteComponent} from './Component/show-label-note/show-label-note.component';
import {Note} from './model/Note';
import * as path from 'path';
import {EditNodeComponent} from './Component/edit-node/edit-node.component';


let labelName;
const routes: Routes = [
  { path: '', component: SignupComponent },
  {path: 'signup', component: SignupComponent},
{ path: 'login', component: LoginComponent },
 { path: 'forget-password', component: ForgetPasswordComponent},
 { path: 'reset-password', component: ResetPasswordComponent},
 { path: 'dash-board' , component: DashBoardComponent,
   children: [
     { path: '', redirectTo: 'create-node', pathMatch: 'full' },
     { path: 'r', redirectTo: 'reminders', pathMatch: 'full' },
     { path: 'd', redirectTo: 'delete-note', pathMatch: 'full' },
     { path: 'a', redirectTo: 'archive', pathMatch: 'full' },
     { path: 'l', redirectTo: 'label_Panel', pathMatch: 'full' },
     { path: 'create-node', component: CreateNoteComponent},
     { path: 'reminders' , component: RemindersComponent},
     { path: 'delete-note' , component: DeleteNoteComponent},
     { path: 'archive' , component: ArchiveComponent},
     { path: 'label_Panel' , component: ShowLabelNoteComponent},
   ],
 },
  {path: 'edit', component: EditNodeComponent, data: Note},

{ path: 'icon-collector', component: IconCollectorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
