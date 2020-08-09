import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Note} from '../../model/Note';
import {NoteServiceService} from '../../Service/note-service.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {getHttpsCall} from '../utils';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss']
})
export class RemindersComponent implements OnInit {
  isShowing = false;
  notes$: Observable<any>;
  allNotes: Note[] = [];
  searchTerm: string;
  createNote: FormGroup;
  indexStatus: number;
  popup: boolean;
  token: string;
  mouseenter(i: number) {
    console.log('mouseenter',this.isShowing)
    this.isShowing = true;
    this.indexStatus = i;
  }

  mouseleave() {
    console.log('mouseleave',this.isShowing)
    this.isShowing = false;
    this.indexStatus = -1;
  }
  constructor(private noteService: NoteServiceService,
              private formBuilder: FormBuilder,) { }

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
    // if (this.createNote) {
    //   this.noteService.note(this.createNote.value, this.token).subscribe((response: any) => {
    //       console.log('response', response);
    //       const newNote: Note = Object.assign(new Note(), this.createNote.value);
    //       console.log('after conversion', newNote);
    //       this.allNotes.push(this.createNote.value);
    //     }
    //   );
    // }
    this.popup = false;
  }

  onPopup() {
    this.popup = true;
  }

  getAllNotes() {
    this.notes$ = getHttpsCall('http://fundoonotes.incubation.bridgelabz.com/api/notes/getNotesList?access_token=' + localStorage.getItem('token'));
    this.notes$.subscribe(data => {
      this.allNotes = Object.values(data.reminder);
      console.log('all Notes Mat Card', this.allNotes);
    });
  }
}
