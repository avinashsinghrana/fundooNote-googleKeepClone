import {Component, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {NoteServiceService} from '../utils/note-service.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {LebelDialogComponent} from '../lebel-dialog/lebel-dialog.component';
import {LoginComponent} from '../login/login.component';
import {getHttpsCall} from '../utils/utils';
import {Label} from '../../model/Label';
import {input} from 'jspm/lib/project';


@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit, OnChanges {
  title = 'refreshPage';
  step = 0;
  loginStatus = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  img: string = null;
  // lebelList: string[] = [];
  viewState = 'list';
  currentSelect: string = 'Notes';
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('sidenav1') sidenav1: MatSidenav;
  isExpanded = true;
  isShowing = false;
  popup: boolean;
  createNote: FormGroup;
  token: string;
  searchTerm: string;
  matmenuStatus: boolean;
  sidenavshow: boolean = true;
  @Input() lebelList: Label[] = [];
  @Inject(MAT_DIALOG_DATA) public data: Label;
  labels: any;
  profilePic: string;
  imageUrl: string;
  username: string;
  usermail: string;

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

    localStorage.setItem('status', this.viewState);
    this.imageUrl = localStorage.getItem('imageUrl');
    this.username = localStorage.getItem('fullName');
    this.usermail = localStorage.getItem('email');
    this.token = localStorage.getItem('token');
    this.getAllLabels();
    this.noteService.currentLebel$.subscribe((response) => {
      this.lebelList = response;
      console.log('lebel list in dashboard', this.lebelList);
      console.log('lebel list response', response);
    });
    if(localStorage.getItem('email') !== null) {
      this.matmenuStatus = true;
    }else {
      this.matmenuStatus = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void{
    // this.noteService.currentLebel$.subscribe((response) => {
    //   this.lebelList = response;
    //   console.log('lebel list in dashboard', this.lebelList);
    //   console.log('lebel list response', response);
    // });
  }

  getAllLabels() {
    const resp$ = getHttpsCall('/noteLabels/getNoteLabelList?access_token='+this.token, 'get');
    resp$.subscribe((ress: any) => {
      this.lebelList = ress.data.details;
      console.log('api call for get notes', this.lebelList);
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
        height: 'fit-content',
      });
    } else {
      // this.snack.open('Hi, ' + localStorage.getItem('fullName') + ', you are on dashboard! ', 'ok', {duration: 2000});
      this.snack.open('Hi, ' + localStorage.getItem('fullName') + ', you are on dashboard! ', 'ok', {
        duration: 1500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  onKey(event) {
    this.noteService.changeEvent(this.searchTerm);
  }

  currentSelection(selection: string) {
    if('editLabels' != selection) {
      this.currentSelect = selection[0].toUpperCase() + selection.slice(1);
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
            height: 'fit-content',
            data: Label
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
      // case 'label': {
      //   this.router.navigate(['/dash-board/l']);
      //   break;
      // }
      default: {
        this.router.navigate(['/dash-board/l']);
        break;
      }
    }
  }

  calculateStyles(input: any) {
    const matcher = input[0].toUpperCase() + input.slice(1);
    if (this.currentSelect == matcher) {
      return {'background-color': '#feefc3',
        'border-top-right-radius': '38px',
      'border-bottom-right-radius': '38px',
              };
    }
  }

  passMenuStatus() {
    this.isExpanded = !this.isExpanded;
    this.sidenavshow = !this.sidenavshow;
  }

  Logout() {
    this.matmenuStatus = false;
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
        this.profilePic = data.status.imageUrl;
        localStorage.setItem('imageUrl', 'http://fundoonotes.incubation.bridgelabz.com/'+this.profilePic);
        this.imageUrl = 'http://fundoonotes.incubation.bridgelabz.com/'+this.profilePic;
        this.snack.open('Profile Pic Updated Successfully', 'OK', {
          duration: 1500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      },
      err => {
        this.snack.open('Updation Failed! Image Format Error.', 'OK', {
          duration: 1500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      });
  }
}
