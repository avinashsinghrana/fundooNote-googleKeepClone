import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Note} from '../../model/Note';
import {NoteServiceService} from '../utils/note-service.service';
import {crudHttpsCallWithToken, getHttpsCall} from '../utils/utils';
import {shareReplay} from 'rxjs/operators';
import {ArchievedObject} from '../../model/ArchievedModel';
import {PinUpinObject} from '../../model/PinUnpinModel';
import {TrashModel} from '../../model/TrashModel';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  isShowing = false;
  notes$: Observable<any>;
  searchTerm: string;
  indexStatus: string;
  token: string;
  allArchivedNote: Note[] = [];

  mouseenter(i: string) {
    console.log('mouseenter', this.isShowing);
    this.isShowing = true;
    this.indexStatus = i;
  }

  mouseleave() {
    console.log('mouseleave', this.isShowing);
    this.isShowing = false;
    this.indexStatus = '';
  }

  constructor(private noteService: NoteServiceService,
              private snack: MatSnackBar,) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.getAllNotes();
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

  getAllNotes() {
    this.notes$ = getHttpsCall('/notes/getArchiveNotesList?access_token=' + this.token, 'get');
    this.notes$.subscribe(response => {
      console.log('archieved api response', response);
      this.allArchivedNote = response.data.data;

    });
  }

  pinNote(note: Note, i: number) {
    this.unarchieve(note, i);
    const for_pinned: PinUpinObject = new PinUpinObject();
    for_pinned.noteIdList = [note.id];
    for_pinned.isPined = true;
    const resp$ = crudHttpsCallWithToken('/notes/pinUnpinNotes?access_token=' + this.token, for_pinned, 'post');
    resp$.subscribe(res => {
      this.snack.open('Note Unarchived to pinned Sucessfully', 'ok', {
        duration: 1500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    });
  }

  unarchieve(note: Note, i: number) {
    const for_archieve: ArchievedObject = new ArchievedObject();
    for_archieve.noteIdList = [note.id];
    for_archieve.isArchived = false;
    const resp$ = crudHttpsCallWithToken('/notes/archiveNotes?access_token=' + this.token, for_archieve, 'post');
    resp$.subscribe(response => {
      this.allArchivedNote.splice(i, 1);
      this.snack.open('Note Unarchived Sucessfully', 'ok', {
        duration: 1500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    });
  }

  trash(note: Note, i: number) {
    const for_delete: TrashModel = new TrashModel();
    for_delete.noteIdList = [note.id];
    for_delete.isDeleted = true;
    const resp$ = crudHttpsCallWithToken('/notes/trashNotes?access_token=' + this.token, for_delete, 'post');
    resp$.subscribe(response => {
      this.allArchivedNote.splice(i, 1);
      this.snack.open('Note added to trash sucessfully', 'ok', {
        duration: 1500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    });
  }
}
