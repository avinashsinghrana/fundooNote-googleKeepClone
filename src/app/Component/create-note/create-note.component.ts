import {Component, Input, OnInit} from '@angular/core';
import {NoteServiceService} from '../../Service/note-service.service';
import {getHttpsCall} from "../utils";
import {Observable} from "rxjs";
import {FormBuilder, FormGroup} from '@angular/forms';
import {Note} from '../../model/Note';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})
export class CreateNoteComponent implements OnInit {
  notes$: Observable<any>;
  allNotes: Note[];
  popup: boolean;
  createNote: FormGroup;
  private token: string;
  isExpanded = false;
  isShowing = false;
  searchTerm: string;
  public colorList = [
    {key: "orange", value: "#fa761e", friendlyName: "Orange" },
    {key: "male",       value: "#4488ff", friendlyName: "Male Color" },
    {key: "female",     value: "#ff44aa", friendlyName: "Female Color" },
    {key: "gargoylegas",  value: "#fde84e", friendlyName: "Gargoyle Gas" },
    {key: "androidgreen",   value: "#9ac53e", friendlyName: "Android Green" },
    {key: "carribeangreen",    value: "#05d59e", friendlyName: "Carribean Green" },
    {key: "bluejeans",    value: "#5bbfea", friendlyName: "Blue Jeans" },
    {key: "cyancornflower",    value: "#1089b1", friendlyName: "Cyan Cornflower" },]
  indexStatus: number;

  constructor(private noteService: NoteServiceService,
              public formBuilder: FormBuilder,
              ) {}

  ngOnInit(): void {
    this.noteService.currentSearch$.subscribe(response => {
      this.searchTerm = response;
    });
    this.createNote = this.formBuilder.group({
      title: '',
      description: ''
    });
    this.getAllNotes();
  }

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

  onPopup() {
    this.popup = true;
  }

  note() {
    this.token = localStorage.getItem('token');
    if (this.createNote) {
      this.noteService.note(this.createNote.value, this.token).subscribe((response: any) => {
          console.log('response', response);
          const newNote: Note = Object.assign(new Note(), this.createNote.value);
          console.log('after conversion', newNote);
          this.allNotes.push(this.createNote.value);
        }
      );
    }
    this.popup = false;
  }

  getAllNotes() {
    this.notes$ = getHttpsCall('http://fundoonotes.incubation.bridgelabz.com/api/notes/getNotesList?access_token=' + localStorage.getItem('token'));
    this.notes$.subscribe(data => {
      this.allNotes = Object.values(data);
      console.log('all Notes Mat Card', this.allNotes);
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

  indexget() {

  }
}
