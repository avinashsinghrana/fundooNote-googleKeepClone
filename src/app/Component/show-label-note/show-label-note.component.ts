import { Component, OnInit } from '@angular/core';
import {Label} from '../../model/Label';
import {Note} from '../../model/Note';
import {crudHttpsCallWithToken, getHttpsCall} from '../utils/utils';
import {PinUpinObject} from '../../model/PinUnpinModel';
import {ArchievedObject} from '../../model/ArchievedModel';
import {TrashModel} from '../../model/TrashModel';
import {Observable} from 'rxjs';
import {NoteServiceService} from '../utils/note-service.service';
import {shareReplay} from 'rxjs/operators';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

@Component({
  selector: 'app-show-label-note',
  templateUrl: './show-label-note.component.html',
  styleUrls: ['./show-label-note.component.scss']
})
export class ShowLabelNoteComponent implements OnInit {
  allRequestedNote: Note[] = [];
  isShowing: boolean;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  indexStatus: string;
  searchTerm: string;
  allPinedNote: Note[] = [];
  allNonPinedNote: Note[] = [];
  private notes$: Observable<any>;
  token: string;
  labelSearchTerm: any;
  pinStatusDuringCreate: boolean = false;
  labelName: string = '';
  allLebel: Label[];
  constructor(private noteService: NoteServiceService,
              private snack: MatSnackBar,) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    // this.getAllNotes();
    this.noteService.currentSearch$.subscribe(response => {
      this.searchTerm = response;
    });
    this.noteService.currentRequestLabelName$.subscribe(response => {
      this.labelName = response;
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

  mouseenter(i: string) {
    this.isShowing = true;
    this.indexStatus = i;
  }

  mouseleave() {
    this.isShowing = false;
    this.indexStatus = '';
  }

  getAllNotes() {
    // this.notes$ = getHttpsCall('/notes/getNotesList?access_token=' + this.token, 'get'), shareReplay();
    // this.notes$.subscribe(data => {
    //   this.notes$.subscribe(notes => {
    //     this.allNonPinedNote = notes.data.data
    //       .filter(note => !note.isPined)
    //       .filter(n => !n.isArchived)
    //       .filter(v => !v.isDeleted);
    //     this.allPinedNote = notes.data.data
    //       .filter(note => note.isPined)
    //       .filter(n => !n.isArchived)
    //       .filter(v => !v.isDeleted);
    //     console.log('all non pined Notes Mat Card', this.allNonPinedNote);
    //     console.log('all pined Notes Mat Card', this.allPinedNote);
    //   });
    // });
  }

  pinNote(note: Note, i: number) {
    if (this.allNonPinedNote.length > 0) {
      note.isPined = true;
      const for_pinned: PinUpinObject = new PinUpinObject();
      for_pinned.noteIdList = [note.id];
      for_pinned.isPined = true;
      const resp$ = crudHttpsCallWithToken('/notes/pinUnpinNotes?access_token=' + this.token, for_pinned, 'post');
      resp$.subscribe(response => {
        this.allPinedNote.push(note);
        this.allNonPinedNote.splice(i, 1);
        this.snack.open('Note added to pinned successfully', 'ok', {
          duration: 1500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      });
    }
  }

  unpinNote(note: Note, i: number) {
    if (this.allPinedNote.length > 0) {
      note.isPined = false;
      const for_pinned: PinUpinObject = new PinUpinObject();
      for_pinned.noteIdList = [note.id];
      for_pinned.isPined = false;
      const resp$ = crudHttpsCallWithToken('/notes/pinUnpinNotes?access_token=' + this.token, for_pinned, 'post');
      resp$.subscribe(response => {
        this.allNonPinedNote.push(note);
        this.allPinedNote.splice(i, 1);
        this.snack.open('Note added to unpinned successfully', 'ok', {
          duration: 1500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      });
    }
  }
  searchNode(event) {
    this.noteService.changeEvent(event);
  }

  unpinCreateNote() {
    this.pinStatusDuringCreate = !this.pinStatusDuringCreate;
  }

  pinCreateNote() {
    this.pinStatusDuringCreate = !this.pinStatusDuringCreate;
  }

  addToArchive(note: Note, i: number) {
    const for_archieve: ArchievedObject = new ArchievedObject();
    for_archieve.noteIdList = [note.id];
    for_archieve.isArchived = true;

    if ( this.allPinedNote.length > 0 && this.allPinedNote.indexOf(note) > -1) {
      const resp$ = crudHttpsCallWithToken('/notes/archiveNotes?access_token=' + this.token, for_archieve, 'post');
      resp$.subscribe(response => {
        this.allPinedNote.splice(i, 1);
      });
    } else {
      const resp$ = crudHttpsCallWithToken('/notes/archiveNotes?access_token=' + this.token, for_archieve, 'post');
      resp$.subscribe(response => {
        this.allNonPinedNote.splice(i, 1);
        console.log('note unpined archieved response', response);

      });
    }
    this.snack.open('Note added to archived successfully', 'ok', {
      duration: 1500,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  trash(note: Note, i: number) {
    const for_delete: TrashModel = new TrashModel();
    for_delete.noteIdList = [note.id];
    for_delete.isDeleted = true;
    if ( this.allNonPinedNote.length > 0 && this.allPinedNote.indexOf(note) > -1) {
      const resp$ = crudHttpsCallWithToken('/notes/trashNotes?access_token=' + this.token, for_delete, 'post');
      resp$.subscribe(response => {
        this.allPinedNote.splice(i, 1);
        console.log('note pined delete response', response);
      });
    } else {
      const resp$ = crudHttpsCallWithToken('/notes/trashNotes?access_token=' + this.token, for_delete, 'post');
      resp$.subscribe(response => {
        this.allNonPinedNote.splice(i, 1);
        console.log('note unpined delete response', response);

      });
    }
    this.snack.open('Note added to trash successfully', 'ok', {
      duration: 1500,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
