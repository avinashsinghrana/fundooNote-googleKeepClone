import {Component, Input, OnInit} from '@angular/core';
import {NoteServiceService} from '../../Service/note-service.service';
import {getHttpsCall} from "../utils";
import {Observable} from "rxjs";

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})
export class CreateNoteComponent implements OnInit {
  notes$: Observable<any>;
  allNotes: any[];


  constructor(private noteService: NoteServiceService) {
  }

  ngOnInit(): void {

    this.getAllNotes();

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
}
