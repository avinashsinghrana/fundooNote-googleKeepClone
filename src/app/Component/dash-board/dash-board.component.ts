import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {NoteServiceService} from '../utils/note-service.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LebelDialogComponent} from '../lebel-dialog/lebel-dialog.component';
import {LoginComponent} from '../login/login.component';
import {Note} from '../../model/Note';
import {getHttpsCall} from '../utils/utils';
import {Label} from '../../model/Label';


@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {
  title = 'refreshPage';
  step = 0;
  loginStatus = false;
  img: string = null;
  // lebelList: string[] = [];
  viewState = 'list';
  currentSelect: string;
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('sidenav1') sidenav1: MatSidenav;
  isExpanded = true;
  isShowing = false;
  popup: boolean;
  createNote: FormGroup;
  token: string;
  searchTerm: string;
  matmenuStatus: boolean = false;
  sidenavshow: boolean = true;
  lebelList: Label[];
  labels: any;
  profilePic: string;

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
              public dialog: MatDialog,
              public snack: MatSnackBar,

  ) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.noteService.currentLebelList$.subscribe(response => {
      this.lebelList = response;
      console.log('lebel list avinash', this.lebelList);
    });
    if(localStorage.getItem('email') !== null) {
      this.matmenuStatus = true;
    }
    this.AllLabels();
  }

  AllLabels() {
    const resp$ = getHttpsCall('/noteLabels/getNoteLabelList?access_token='+this.token);
    resp$.subscribe((ress: any) => {
      this.lebelList = ress.data.details;
      console.log('api call for get notes', ress.data.details);
      this.noteService.changeLebelList(this.lebelList);
    });
  }

  refresh(): void {
    location.reload();
  }


  view(state: any) {
    this.viewState = state;
    localStorage.setItem('status', this.viewState);
  }

  login() {
    if (localStorage.getItem('token') === null) {
      this.dialog.open(LoginComponent, {
        width: '350px',
      });
      // this.router.navigate(['login']);
    } else {
      this.snack.open('Hi, ' + localStorage.getItem('fullName') + ', you are on dashboard! ', 'ok', {duration: 2000});
    }
  }

  onKey(event) {
    this.noteService.changeEvent(this.searchTerm);
  }

  currentSelection(selection: string) {
    if('editLabels' != selection) {
      this.currentSelect = selection;
    }
    switch (selection) {
      case 'notes': {
        this.router.navigate(['/dash-board']);
        break;
      }
      case 'reminders': {
        this.router.navigate(['/dash-board/r']);
        break;
      }
      case 'editLabels': {
          this.dialog.open(LebelDialogComponent, {
            width: '250px',
          });
        break;
      }
      case 'archive': {
        this.router.navigate(['/dash-board/a']);
        break;
      }
      case 'trash': {
        this.router.navigate(['/dash-board/d']);
        break;
      }
      default: {
        this.router.navigate(['/dash-board']);
        break;
      }
    }
  }

  calculateStyles(input: any) {
    if (this.currentSelect == input) {
      return {'background-color': '#feefc3'};
    }
  }

  passMenuStatus() {
    this.isExpanded = !this.isExpanded;
    this.sidenavshow = !this.sidenavshow;
  }

  Logout() {
    localStorage.clear();
    location.reload();
  }

  fileUpload($event) {
    this.uploadprofilePic($event);

  }

  private uploadprofilePic($event) {
    this.profilePic = $event.target.files[0];
    const formData = new FormData();
    formData.append('file', this.profilePic);
    this.noteService.profilePic(this.token, formData).subscribe(
      data => {
        console.log('------------------------------', data);
        const response = data.status.imageUrl;
        this.profilePic = response;
        this.snack.open('Profile Pic Updated Successfully', 'OK',{duration:2000});
        localStorage.setItem('imageUrl', 'http://fundoonotes.incubation.bridgelabz.com/'+this.profilePic);
      },
      err => {
        this.snack.open('Profile pic uplodation failed!!', 'Ok', {duration: 2000});
      });
  }
}
