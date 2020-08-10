import {Component, Input, OnInit} from '@angular/core';
import {NoteServiceService} from '../utils/note-service.service';
import {crudHttpsCallWithToken, getHttpsCall} from '../utils/utils';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Note} from '../../model/Note';
import {map, shareReplay} from 'rxjs/operators';
import {Label} from '../../model/Label';

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
  searchTerm: string;
  allPinedNote: Note[] = [];
  allLebel: Label[] = [];

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
      description: ''
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
      this.createNote$ = crudHttpsCallWithToken('/notes/addNotes?access_token=' + this.token, this.createNote.value, 'post');
      this.createNote$.subscribe((response: any) => {
          console.log('response', response);
          const newNote: Note = Object.assign(new Note(), response.status.details);
          console.log('after conversion', newNote);
          this.allNonPinedNote.push(response.status.details);
          this.createNote.reset();
        }
      );
    }
    this.popup = false;
  }

  getAllNotes() {
    this.notes$ = getHttpsCall('/notes/getNotesList?access_token=' + this.token),shareReplay();
    this.notes$.subscribe(data => {
      this.notes$.subscribe(notes => {
        this.allNonPinedNote = notes.data.data.filter(
          note => note.isPined === false);
        this.allPinedNote = notes.data.data.filter(
          note => note.isPined === true);
        console.log('all non pined Notes Mat Card', this.allNonPinedNote);
        console.log('all pined Notes Mat Card', this.allPinedNote);
      });
      // console.log('all Notes Mat Card', this.allNonPinedNote);
      // console.log('all Notes Mat Card', this.allPinedNote);
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

  pinNote(note: Note,i: number) {
    if (this.allNonPinedNote.length > 0) {
      this.allNonPinedNote[i].isPined = true;
      const resp$ = crudHttpsCallWithToken('/notes/pinUnpinNotes?access_token=' + this.token, note, 'post');
      resp$.subscribe(response => {
        console.log('note pined response', response);
      });
    }
    this.allPinedNote.push(note);
    console.log('note unpined data', this.allNonPinedNote);

    this.allNonPinedNote.splice(i, 1);
    console.log('note pined data', this.allPinedNote);
  }

  unpinNote(note: Note, i: number) {
    if (this.allPinedNote.length > 0) {
      this.allPinedNote[i].isPined = false;
      note.isPined=false;
      const resp$ = crudHttpsCallWithToken('/notes/pinUnpinNotes?access_token=' + this.token, note, 'post');
      resp$.subscribe(response => {
        // this.allNonPinedNote.push(note);
        // this.allPinedNote.splice(i, 1);
        console.log('note unpined response', response);
      });
      this.allNonPinedNote.push(note);
      console.log('note unpined response', this.allNonPinedNote);

      this.allPinedNote.splice(i, 1);
      console.log('note pined response', this.allPinedNote);

    }
  }

  searchNode(event) {
    this.noteService.changeEvent(event);
  }
}
