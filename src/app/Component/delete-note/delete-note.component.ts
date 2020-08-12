import { Component, OnInit } from '@angular/core';
import {NoteServiceService} from '../utils/note-service.service';
import {Observable} from 'rxjs';
import {Note} from '../../model/Note';
import {crudHttpsCallWithToken, getHttpsCall} from '../utils/utils';
import {ArchievedObject} from '../../model/ArchievedModel';
import {TrashModel} from '../../model/TrashModel';

@Component({
  selector: 'app-delete-note',
  templateUrl: './delete-note.component.html',
  styleUrls: ['./delete-note.component.scss']
})
export class DeleteNoteComponent implements OnInit {
  isShowing = false;
  notes$: Observable<any>;
  searchTerm: string;
  indexStatus: string;
  allTrashNote: Note[] = [];
  token: string;
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
    this.token = localStorage.getItem('token');
    this.getAllTrashNotes();
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

  deleteForever(note: Note, i: number) {
    const for_forever_Delete: TrashModel = new TrashModel();
    for_forever_Delete.noteIdList = [note.id];
    for_forever_Delete.isDeleted = false;
    const resp$ = crudHttpsCallWithToken('/notes/deleteForeverNotes?access_token=' + this.token, for_forever_Delete, 'post');
    resp$.subscribe(response => {
      this.allTrashNote.splice(i, 1);
      console.log('note unpined delete response', response);
    });
  }

  restore(note: Note, i: number) {
    const for_restore: TrashModel = new TrashModel();
    for_restore.noteIdList = [note.id];
    for_restore.isDeleted = false;
    const resp$ = crudHttpsCallWithToken('/notes/trashNotes?access_token=' + this.token, for_restore, 'post');
    resp$.subscribe(response => {
      this.allTrashNote.splice(i, 1);
      console.log('note unpined delete response', response);
    });
  }

  getAllTrashNotes() {
    this.notes$ = getHttpsCall('/notes/getTrashNotesList?access_token=' + this.token);
    this.notes$.subscribe(response => {
      console.log('archieved api response', response);
      this.allTrashNote = response.data.data;
    });
  }
}
