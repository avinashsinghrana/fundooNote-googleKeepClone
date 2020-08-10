import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {NoteServiceService} from '../utils/note-service.service';
import {Label} from '../../model/Label';
import {crudHttpsCallWithToken, getHttpsCall} from '../utils/utils';

@Component({
  selector: 'app-lebel-dialog',
  templateUrl: './lebel-dialog.component.html',
  styleUrls: ['./lebel-dialog.component.scss']
})
export class LebelDialogComponent implements OnInit {
  lebelName: string;
  lebelList: Label[] = [];
  userId: string;
  token: string;

  constructor(private noteService: NoteServiceService,
    public dialogRef: MatDialogRef<LebelDialogComponent>
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.userId = localStorage.getItem('userId');
    this.noteService.changeLebelList(this.lebelList);
  }

  onNoClick(input: string): void {
    let label = new Label();
    label.label = input;
    label.isDeleted = false;
    label.userId = this.userId;
    const res$ = crudHttpsCallWithToken('/noteLabels?access_token='+this.token, label, 'POST');
    res$.subscribe((response: any) => {
      label.id = response.id;
      this.lebelList.push(label);
      console.log('add lebel' , response);
      console.log('current label', label);
    });
    this.noteService.changeLebelList(this.lebelList);
    this.lebelName = '';
    console.log('current lebel data', label);
    console.log('total edit lebel', this.lebelList);
  }


  onCloseDialog(lebelName: string) {
    let label = new Label();
    label.label = lebelName;
    label.isDeleted = false;
    label.userId = this.userId;
    this.noteService.changeLebelList(this.lebelList);
    const res$ = crudHttpsCallWithToken('/noteLabels?access_token='+this.token, label, 'POST');
    res$.subscribe((response: any) => {
      label.id = response.id;
      this.lebelList.push(label);
      console.log('add lebel' , response);
    });
    this.lebelName = '';
    this.dialogRef.close();
  }
}
