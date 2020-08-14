import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {NoteServiceService} from '../utils/note-service.service';
import {Label} from '../../model/Label';
import {crudHttpsCallWithToken, getHttpsCall} from '../utils/utils';
import {fakeAsync} from '@angular/core/testing';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {DashBoardComponent} from '../dash-board/dash-board.component';

@Component({
  selector: 'app-lebel-dialog',
  templateUrl: './lebel-dialog.component.html',
  styleUrls: ['./lebel-dialog.component.scss']
})
export class LebelDialogComponent implements OnInit {
  labelName: string = '';
  lebelList: Label[] = [];
  userId: string;
  token: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  editCall: number = -1;
  note_label_creation_status = 200;
  updated_value_of_label: string = '';
  isShowing: boolean = false;
  status_of_current_label: number = -1;

  constructor(private noteService: NoteServiceService,
              public dialogRef: MatDialogRef<LebelDialogComponent>,
              private snack: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.userId = localStorage.getItem('userId');
    this.getAllLabels();
  }

  getAllLabels() {
    const resp$ = getHttpsCall('/noteLabels/getNoteLabelList?access_token=' + this.token, 'get');
    resp$.subscribe((ress: any) => {
      this.lebelList = ress.data.details;
    });
  }


  onNoClick(): void {
    const existanceOfLabel: Label[] = this.lebelList.filter(labelData => labelData.label === this.labelName);
    if (existanceOfLabel.length <= 0) {
      let newLabel: Label = new Label();
      newLabel.label = this.labelName;
      newLabel.isDeleted = false;
      newLabel.userId = this.userId;
      const res$ = crudHttpsCallWithToken('/noteLabels?access_token=' + this.token, newLabel, 'POST');
      res$.subscribe((response: any) => {
        newLabel.id = response.id;
        this.lebelList.push(newLabel);
        this.noteService.changeLebelList(this.lebelList);
        this.snack.open('Label created successfully', 'ok', {
          duration: 1500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      });
      this.labelName = '';
      this.note_label_creation_status = 200;
    } else {
      this.note_label_creation_status = 404;
    }
  }


  onCloseDialog() {
    const existanceOfLabel: Label[] = this.lebelList.filter(labelData => labelData.label === this.labelName);
    if (existanceOfLabel.length <= 0 && this.labelName !== '') {
      let newLabel: Label = new Label();
      newLabel.label = this.labelName;
      newLabel.isDeleted = false;
      newLabel.userId = this.userId;
      const res$ = crudHttpsCallWithToken('/noteLabels?access_token=' + this.token, newLabel, 'POST');
      res$.subscribe((response: any) => {
        newLabel.id = response.id;
        this.lebelList.push(newLabel);
        this.noteService.changeLebelList(this.lebelList);
        this.snack.open('Label created successfully', 'ok', {
          duration: 1500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.labelName = '';
        this.note_label_creation_status = 200;
      });
    }
    if(existanceOfLabel.length > 0){
      this.snack.open('Label already exists..', 'ok', {
        duration: 1500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    this.dialogRef.close();
  }

  editOnClick(label: Label, i: number) {
    this.editCall = i;

  }

  deleteOnClick(label: Label, i: number) {
    const res$ = getHttpsCall('/noteLabels/' + label.id + '/deleteNoteLabel?access_token=' + this.token, 'delete');
    res$.subscribe((response: any) => {
      this.noteService.changeLebelList(this.lebelList);
      this.lebelList.splice(i, 1);
      this.snack.open('Label deleted successfully', 'ok', {
        duration: 1500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    });
  }


  mouseenter(i: number) {
    this.isShowing = true;
    this.status_of_current_label = i;
  }

  mousemove() {
    this.isShowing = false;
    this.status_of_current_label = -1;
  }

  onUpdate(label: Label, i: number) {
    const res$ = crudHttpsCallWithToken('/noteLabels/' + label.id + '/updateNoteLabel?access_token=' + this.token, label,'post');
    res$.subscribe((response: any) => {
      this.noteService.changeLebelList(this.lebelList);
      this.snack.open('Label updated successfully', 'ok', {
        duration: 1500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      this.editCall = -1;
    });
  }
}
