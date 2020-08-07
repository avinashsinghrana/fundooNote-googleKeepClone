import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NoteServiceService} from '../../Service/note-service.service';
import {LoginComponent} from '../login/login.component';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {getHttpsCall} from '../utils';
import {BehaviorSubject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {
  title = 'refreshPage';
  // private noteData: any = new BehaviorSubject<any>([]);
  step = 0;
  noteData: any = [];
  loginStatus = false;
  img: string = null;
  viewState = 'grid';
  panelOpenState = false;
  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = true;
  isShowing = false;
  popup: boolean;
  createNote: FormGroup;
  private token: string;

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
              public dialog: MatDialog,
              public snack: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    // this.noteService.currentLoginStatus$.subscribe(data => {
    //   console.log('user status');
    // });
    this.createNote = this.formBuilder.group({
      title: '',
      description: ''
    });
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
    location.reload();
  }

  onPopup() {
    this.popup = true;
  }

  note() {
    this.token = localStorage.getItem('token');
    if (this.createNote) {
      this.noteService.note(this.createNote.value, this.token).subscribe((response: any) => {
          console.log('response', response);
          location.reload();

        }
      );
    }
    this.popup = false;

  }


  view(state: any) {
    this.viewState = state;
    localStorage.setItem('status', this.viewState);
    console.log('state changed to  : ', state);
    console.log('view state changed to  : ', this.viewState);
  }

  login() {
    if (localStorage.getItem('token') === null) {
      // this.dialog.open(LoginComponent, {
      //   width: 'inherit'
      // });
      this.router.navigate(['login']);
    } else {
      this.snack.open('already logedin', 'ok', {duration: 2000});
    }
  }
}
