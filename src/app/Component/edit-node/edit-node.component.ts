import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Note} from '../../model/Note';
import {NoteServiceService} from '../utils/note-service.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {crudHttpsCallWithToken, getHttpsCall} from '../utils/utils';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {Label} from '../../model/Label';

@Component({
  selector: 'app-edit-node',
  templateUrl: './edit-node.component.html',
  styleUrls: ['./edit-node.component.scss']
})
export class EditNodeComponent implements OnInit {
  updateNote: FormBuilder;
  for_update_note: Note = this.data;
  pinStatusDuringCreate: boolean = false;
  isShowing: boolean;
  indexStatus: Boolean;
  labelName: any;
  color: string;
  description: string = '';
  title: string = '';
  token: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  allLebel: Label[];

  constructor(private noteService: NoteServiceService,
              private dialogRef: MatDialogRef<EditNodeComponent>,
              private snack: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: Note,) { }

  ngOnInit(): void {
  }

  unpinCreateNote() {
    this.data.isPined = false;
  }

  pinCreateNote() {
      this.data.isPined = true;
  }

  note() {
    this.dialogRef.close();
  }

  trash() {
    this.data.isDeleted = true;
    this.note();
    this.dialogRef.close();
  }

  addToArchive() {
    this.data.isArchived = true;
    this.snack.open('Note added to archive', 'ok', {
      duration: 1500,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  add_lebel_to_note(labelTag: Label) {
    const labeList : Label[] = this.data.noteLabels;
    if(!labeList.includes(labelTag)){
      const res$ = getHttpsCall('/notes/'+this.data.id+'/addLabelToNotes/'+labelTag.id+'/add?access_token='+this.token, 'post');
      res$.subscribe(console.log);
      this.snack.open("A New Label Assigned to Note", 'OK', {
        duration: 1500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }else {
      this.snack.open("Label Already Assigned", 'OK', {
        duration: 1500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  chooseColor(color: string) {

  }
}
