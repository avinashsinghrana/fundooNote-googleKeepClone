import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Note} from '../../model/Note';
import {NoteServiceService} from '../utils/note-service.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {crudHttpsCallWithToken, getHttpsCall} from '../utils/utils';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {Label} from '../../model/Label';
import {DataServiceModel} from '../../model/DataServiceModel';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss']
})
export class RemindersComponent implements OnInit {
  isShowing: boolean;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  indexStatus: string;
  searchTerm: string;
  allPinedNote: Note[] = [];
  allNonPinedNote: Note[] = [];
  notes$: Observable<any>;
  token: string;
  dataServiceModel: DataServiceModel;
  labelName: string = '';
  nav_select_item: string;
  allLebel: Label[];
  labelList: Label[] = [];
  allNotes: Note[] = [];
  createNote: FormGroup;
  popup: boolean;
  pinStatusDuringCreate: boolean = false;
  newNote: Note;

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
              private formBuilder: FormBuilder,
              private snack: MatSnackBar,
              ) { }

  ngOnInit(): void {
    console.log('reminder page');
    this.noteService.currentSearch$.subscribe(response => {
      this.searchTerm = response;
    });
    this.createNote = this.formBuilder.group({
      title: '',
      description: ''
    });
    this.getAllNotes();
  }

  grid(): boolean {
    const gridStatus = localStorage.getItem('status');
    if (gridStatus === 'grid') {
      return true;
    } else {
      return false;
    }
  }

  note() {
    this.token = localStorage.getItem('token');
    if (this.createNote) {
      const newNote_1: Note = Object.assign(new Note(), this.createNote.value);
      newNote_1.isPined = this.pinStatusDuringCreate;
      const createNote$ = crudHttpsCallWithToken('/notes/addNotes?access_token=' + this.token, newNote_1, 'post');
      createNote$.subscribe((response: any) => {
          this.newNote = Object.assign(new Note(), response.status.details);
          if (this.pinStatusDuringCreate == false) {
            this.allNonPinedNote.push(response.status.details);
          } else {
            this.allPinedNote.push(response.status.details);
          }
          this.snack.open('Note Created Sucessfully', 'ok', {
            duration: 1500,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.newNote = null;
          this.createNote.reset();
        }
      );
    }
    this.popup = false;
  }

  onPopup() {
    this.popup = true;
  }

  getAllNotes() {
    this.notes$ = getHttpsCall('/notes/getNotesList?access_token=' + this.token,'get');
    this.notes$.subscribe(response => {
      this.allNotes = response.data.data
        .filter(data => data.reminder.length > 0 );
      console.log('all Notes Mat Card', this.allNotes);
    });
  }

  unpinNote(note: Note, i: number) {
    let dataServiceModel;
    dataServiceModel.note = note;
    dataServiceModel.indexOfNote = i;
    this.noteService.calling_method_unpinNote(this.dataServiceModel);
    this.dataServiceModel = undefined;
  }

  pinNote(note: Note, i: number) {
    let dataServiceModel;
    dataServiceModel.note = note;
    dataServiceModel.indexOfNote = i;
    this.noteService.calling_method_pinNote(this.dataServiceModel);
    this.dataServiceModel = undefined;
  }

  editNodeDialogBox(note: Note) {
    let dataServiceModel;
    dataServiceModel.note = note;
    this.noteService.calling_method_EditNode(this.dataServiceModel);
    this.dataServiceModel = undefined;
  }

  delete_label_from_note(labelTag: Label, note: Note, i: number, nl: number) {
    let dataServiceModel;
    dataServiceModel.note = note;
    this.noteService.calling_method_Delete_label_Note(this.dataServiceModel);
    this.dataServiceModel = undefined;
  }

  addToArchive(note: Note, i: number) {
    let dataServiceModel;
    dataServiceModel.note = note;
    this.noteService.calling_method_AddToArchive(this.dataServiceModel);
    this.dataServiceModel = undefined;
  }

  trash(note: Note, i: number) {
    let dataServiceModel;
    dataServiceModel.note = note;
    this.noteService.calling_method_AddToTrash(this.dataServiceModel);
    this.dataServiceModel = undefined;
  }

  add_lebel_to_note(subtask: Label, note: Note, i: number) {
    let dataServiceModel;
    dataServiceModel.note = note;
    this.noteService.changelabelToNoteSource(this.dataServiceModel);
    this.dataServiceModel = undefined;
  }
}
