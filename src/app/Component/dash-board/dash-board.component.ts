import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import{ Location } from '@angular/common';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NoteServiceService} from '../../Service/note-service.service';
import {LoginComponent} from '../login/login.component';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {
  title='refreshPage';

  step = 0;
  loginStatus: boolean = false;
  img: string = null;
  viewState : string = 'list';
  panelOpenState = false;
  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = true;
  isShowing = false;
   popup: boolean;
  createNote: FormGroup;
  @Inject(MAT_DIALOG_DATA) dialog: MatDialog;

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  constructor(public router: Router,
              public noteService: NoteServiceService,
              public formBuilder: FormBuilder,
              public location: Location,
              ) { }

  ngOnInit(): void {
    this.noteService.currentLoginStatus$.subscribe(data => {
      console.log('user status');
    });
    this.createNote = this.formBuilder.group({
      title: '',
      description: ''
    })
  }


  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  refresh(): void {
    this.router.navigateByUrl("/", { skipLocationChange: true}).then()
      this.router.navigate([decodeURI(this.location.path())]);

  }
  onPopup() {
    this.popup = true;
  }

  note() {


    // this.token = localStorage.getItem('token');
    // if (this.createNote)
    //   this.NoteService.note(this.createNote.value,this.token).subscribe((response: any) => {
    //       console.log("response",response);
    //       this.popup=false;
    //     }
    //   )}
    this.popup = false;
  }

  view(state: any) {
    this.viewState = state;
    console.log('state changed to  : '   ,  state);
    console.log('view state changed to  : '   ,  this.viewState);
  }

  login() {
    if(!this.loginStatus.valueOf()){
      this.dialog.open(LoginComponent, {
        width: '28%',
        height: 'auto'
      });
    }
  }
}
