import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {NoteServiceService} from '../../Service/note-service.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LebelDialogComponent} from '../lebel-dialog/lebel-dialog.component';


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

  sidenavshow: boolean = true;
  lebelList: string[];

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
    // this.isShowing = true;
    // this.isExpanded = true;
    // this.sidenavshow = true;
  }




  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
    // this.isShowing = false;
    // this.isExpanded = false;
    // this.sidenavshow = false;
  }

  constructor(public router: Router,
              public noteService: NoteServiceService,
              public dialog: MatDialog,
              public snack: MatSnackBar,

  ) {
  }

  ngOnInit(): void {
    this.noteService.currentLebelList$.subscribe(response => {
      this.lebelList = response;
    });
  }

  refresh(): void {
    location.reload();
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
          const dialogRef = this.dialog.open(LebelDialogComponent, {
            width: '250px',
          });
          // dialogRef.afterClosed().subscribe(result => {
          //   console.log('The dialog was closed');
          //   this.lebelName = result;
          // });
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
}
