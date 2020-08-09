import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Note} from '../../model/Note';
import {NoteServiceService} from '../../Service/note-service.service';

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
  indexStatus: number;
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

  constructor(private noteService: NoteServiceService,) { }

  ngOnInit(): void {
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


}
