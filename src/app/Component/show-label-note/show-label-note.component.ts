import {Component, Input, OnInit} from '@angular/core';
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
import {EditNodeComponent} from '../edit-node/edit-node.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-show-label-note',
  templateUrl: './show-label-note.component.html',
  styleUrls: ['./show-label-note.component.scss']
})
export class ShowLabelNoteComponent implements OnInit {
  isShowing: boolean;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  indexStatus: string;
  searchTerm: string;
  allPinedNote: Note[] = [];
  allNonPinedNote: Note[] = [];
  private notes$: Observable<any>;
  token: string;
  labelName: string = '';
  nav_select_item: string;
  allLebel: Label[];
  labelList: Label[] = [];

  constructor(private noteService: NoteServiceService,
              private snack: MatSnackBar,
              private dialog: MatDialog,) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.noteService.currentSearch$.subscribe(response => {
      this.searchTerm = response;
    });
    this.noteService.currentRequestLabelName$.subscribe(response => {
      this.getAllNotes(response);
      this.nav_select_item = response;
    });
    this.getAllLabels();
  }

  getAllLabels() {
    const resp$ = getHttpsCall('/noteLabels/getNoteLabelList?access_token=' + this.token, 'get');
    resp$.subscribe((ress: any) => {
      this.allLebel = ress.data.details;
      console.log('api call for get notes', this.allLebel);
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

  getAllNotes(respose: string) {
    this.notes$ = getHttpsCall('/notes/getNotesListByLabel/' + respose + '?access_token=' + this.token, 'post');
    this.notes$.subscribe(notes => {
      this.allNonPinedNote = notes.data.data
        .filter(note_i => !note_i.isPined);
      this.allPinedNote = notes.data.data
        .filter(note_i => note_i.isPined);
      console.log('all non pined Notes Mat Card', this.allNonPinedNote);
      console.log('all pined Notes Mat Card', this.allPinedNote);
    });
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

  addToArchive(note: Note, i: number) {
    const for_archieve: ArchievedObject = new ArchievedObject();
    for_archieve.noteIdList = [note.id];
    for_archieve.isArchived = true;

    if (this.allPinedNote.length > 0 && this.allPinedNote.indexOf(note) > -1) {
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
    if (this.allNonPinedNote.length > 0 && this.allPinedNote.indexOf(note) > -1) {
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

  add_lebel_to_note(labelTag: Label, note: Note, i: number) {
    const resp$ = getHttpsCall('/notes/'+note.id+'/addLabelToNotes/'+labelTag.id+'/add?access_token='+this.token, 'post');
    resp$.subscribe((ress: any) => {
      if(note.isPined === true){
        if(!this.allPinedNote[i].noteLabels.includes(labelTag)){
          this.allPinedNote[i].noteLabels.push(labelTag);
        }
        else{
          this.snack.open("Label Already Assigned",'OK',{
            duration: 1500,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
      else{
        if(!this.allNonPinedNote[i].noteLabels.includes(labelTag)) {
          this.allNonPinedNote[i].noteLabels.push(labelTag);
        }
        else {
          this.snack.open("Label Already Assigned",'OK',{
            duration: 1500,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    });
  }

  delete_label_from_note(labelTag: Label, note: Note, i: number, nl: number) {
    const ress$ = getHttpsCall('/notes/' + note.id + '/addLabelToNotes/' + labelTag.id + '/remove?access_token=' + this.token, 'post');
    ress$.subscribe(ress =>{
      if (note.isPined === true) {
        if (labelTag.label == this.nav_select_item) {
          this.allPinedNote.splice(i, 1);
        }else { this.allPinedNote[i].noteLabels.splice(nl, 1); }
      } else {
        if (labelTag.label === this.nav_select_item) {
          this.allNonPinedNote.splice(i, 1);
        }else { this.allNonPinedNote[i].noteLabels.splice(nl, 1); }
      }
    });
  }

  editNodeDialogBox(note: Note) {
    this.dialog.open(EditNodeComponent, {
      width: '516px',
      height: 'fit-content',
      data: note,
    });
  }
}
