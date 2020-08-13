import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Note} from '../../model/Note';

@Component({
  selector: 'app-edit-node',
  templateUrl: './edit-node.component.html',
  styleUrls: ['./edit-node.component.scss']
})
export class EditNodeComponent implements OnInit {
  updateNote: FormBuilder;
  for_update_note: Note;
  pinStatusDuringCreate: boolean = false;
  isShowing: boolean;
  indexStatus: Boolean;
  labelName: any;
  description: string;
  title: string;

  constructor() { }

  ngOnInit(): void {
  }

  unpinCreateNote() {

  }

  pinCreateNote() {

  }

  note() {

  }

  trash(note: any, i: any) {

  }

  addToArchive(note: any, i: any) {

  }

  onCloseDialog() {

  }
}
