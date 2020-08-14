import { Component, OnInit } from '@angular/core';
import {NoteServiceService} from '../utils/note-service.service';
import {Observable} from 'rxjs';
import {Note} from '../../model/Note';
import {crudHttpsCallWithToken, getHttpsCall} from '../utils/utils';
import {ArchievedObject} from '../../model/ArchievedModel';
import {TrashModel} from '../../model/TrashModel';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-note',
  templateUrl: './delete-note.component.html',
  styleUrls: ['./delete-note.component.scss']
})
export class DeleteNoteComponent implements OnInit {
  isShowing = false;
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  notes$: Observable<any>;
  searchTerm: string;
  indexStatus: string;
  allTrashNote: Note[] = [];
  token: string;
  mouseenter(i: string) {
    console.log('mouseenter',this.isShowing)
    this.isShowing = true;
    this.indexStatus = i;
  }

  mouseleave() {
    console.log('mouseleave',this.isShowing)
    this.isShowing = false;
    this.indexStatus = '';
  }

  constructor(private noteService: NoteServiceService,
              private  snack: MatSnackBar,) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.getAllTrashNotes();
    this.noteService.currentSearch$.subscribe(response => {
      this.searchTerm = response;
    });
  }

  grid(): boolean {
    const gridStatus = localStorage.getItem('status');
    if (gridStatus === 'grid') {
      return true;
    } else {
      return false;
    }
  }

  deleteForever(note: Note, i: number) {
    const for_forever_Delete: TrashModel = new TrashModel();
    for_forever_Delete.noteIdList = [note.id];
    for_forever_Delete.isDeleted = false;
    const resp$ = crudHttpsCallWithToken('/notes/deleteForeverNotes?access_token=' + this.token, for_forever_Delete, 'post');
    resp$.subscribe(response => {
      this.allTrashNote.splice(i, 1);
      this.snack.open('Note Deleted permanetly', 'ok', {
        duration: 1500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    });
  }

  restore(note: Note, i: number) {
    const for_restore: TrashModel = new TrashModel();
    for_restore.noteIdList = [note.id];
    for_restore.isDeleted = false;
    const resp$ = crudHttpsCallWithToken('/notes/trashNotes?access_token=' + this.token, for_restore, 'post');
    resp$.subscribe(response => {
      this.allTrashNote.splice(i, 1);
      this.snack.open('Note restored successfully', 'ok', {
        duration: 1500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    });
  }

  getAllTrashNotes() {
    this.notes$ = getHttpsCall('/notes/getTrashNotesList?access_token=' + this.token, 'get');
    this.notes$.subscribe(response => {
      this.allTrashNote = response.data.data;
    });
  }
}
