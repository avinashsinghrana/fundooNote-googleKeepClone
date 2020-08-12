import {Component, Input, OnInit} from '@angular/core';
import {NoteServiceService} from '../utils/note-service.service';
import {crudHttpsCallWithToken, getHttpsCall} from '../utils/utils';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Note} from '../../model/Note';
import {map, shareReplay} from 'rxjs/operators';
import {Label} from '../../model/Label';
import {PinUpinObject} from '../../model/PinUnpinModel';
import {ArchievedObject} from '../../model/ArchievedModel';
import {TrashModel} from '../../model/TrashModel';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})

export class CreateNoteComponent implements OnInit {
  notes$: Observable<any>;
  createNote$: Observable<any>;
  allNonPinedNote: Note[] = [];
  popup: boolean;
  createNote: FormGroup;
  private token: string;
  isExpanded = false;
  isShowing = false;
  newNote: Note;
  searchTerm: string;
  allPinedNote: Note[] = [];
  allLebel: Label[] = [];
  allArchivedNote: Note[] = [];


  public colorList = [
    {key: 'orange', value: '#fa761e', friendlyName: 'Orange'},
    {key: 'male', value: '#4488ff', friendlyName: 'Male Color'},
    {key: 'female', value: '#ff44aa', friendlyName: 'Female Color'},
    {key: 'gargoylegas', value: '#fde84e', friendlyName: 'Gargoyle Gas'},
    {key: 'androidgreen', value: '#9ac53e', friendlyName: 'Android Green'},
    {key: 'carribeangreen', value: '#05d59e', friendlyName: 'Carribean Green'},
    {key: 'bluejeans', value: '#5bbfea', friendlyName: 'Blue Jeans'},
    {key: 'cyancornflower', value: '#1089b1', friendlyName: 'Cyan Cornflower'},];
  indexStatus: string;
  labelSearchTerm: any;
  pinStatusDuringCreate: boolean = false;

  constructor(private noteService: NoteServiceService,
              public formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.getAllNotes();
    this.noteService.currentSearch$.subscribe(response => {
      this.searchTerm = response;
    });
    this.noteService.currentLebelList$.subscribe(response => {
      this.allLebel = response;
    });
    this.createNote = this.formBuilder.group({
      title: '',
      description: '',
      isPined: false,
    });
  }

  mouseenter(i: string) {
    this.isShowing = true;
    this.indexStatus = i;
  }

  mouseleave() {
    this.isShowing = false;
    this.indexStatus = '';
  }

  onPopup() {
    this.popup = true;
  }

  note() {
    this.token = localStorage.getItem('token');
    if (this.createNote) {
      const newNote_1: Note = Object.assign(new Note(), this.createNote.value);
      newNote_1.isPined = this.pinStatusDuringCreate;
      this.createNote$ = crudHttpsCallWithToken('/notes/addNotes?access_token=' + this.token, newNote_1, 'post');
      this.createNote$.subscribe((response: any) => {
          console.log('response', response);
          this.newNote = Object.assign(new Note(), response.status.details);
          console.log('after conversion', this.newNote);
          // Refactor need to maintain with data base
          if (this.pinStatusDuringCreate == false) {
            this.allNonPinedNote.push(response.status.details);
          } else {
            // response.status.details.isPined = true;
            this.allPinedNote.push(response.status.details);
          }
          this.newNote = null;
          this.createNote.reset();
        }
      );
    }
    this.popup = false;
  }

  getAllNotes() {
    this.notes$ = getHttpsCall('/notes/getNotesList?access_token=' + this.token), shareReplay();
    this.notes$.subscribe(data => {
      this.notes$.subscribe(notes => {
        this.allNonPinedNote = notes.data.data
          .filter(note => !note.isPined)
          .filter(n => !n.isArchived)
          .filter(v => !v.isDeleted);
        this.allPinedNote = notes.data.data
          .filter(note => note.isPined)
          .filter(n => !n.isArchived)
          .filter(v => !v.isDeleted);
        console.log('all non pined Notes Mat Card', this.allNonPinedNote);
        console.log('all pined Notes Mat Card', this.allPinedNote);
      });
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
        console.log('note pined archieved response', response);
      });
    } else {
      const resp$ = crudHttpsCallWithToken('/notes/archiveNotes?access_token=' + this.token, for_archieve, 'post');
      resp$.subscribe(response => {
        this.allNonPinedNote.splice(i, 1);
        console.log('note unpined archieved response', response);

      });
    }
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
  }
}
