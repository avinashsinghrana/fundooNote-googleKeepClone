import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Note} from '../../model/Note';
import {NoteServiceService} from '../utils/note-service.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  isShowing = false;
  notes$: Observable<any>;
  allNotes: Note[] = [];
  searchTerm: string;
  indexStatus: string;
  allNonPinedNote: Note[];
  allArchivedNote: Note[] = [];
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

  constructor(private noteService: NoteServiceService,) { }

  ngOnInit(): void {
    // this.noteService.changeInArchive(this.allArchivedNote);
    this.noteService.currentArchievedData$.subscribe(responses => {
      responses.forEach(response => {
        this.allArchivedNote.push(response);
        console.log('individual response fo archieved Node', response);
        console.log('array of archieved',  this.allArchivedNote);
      });
    });
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


  unpinNote(note: Note, i: number) {

  }

  pinNote(note: Note, i: number) {

  }
}
