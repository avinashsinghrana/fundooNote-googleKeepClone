import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {NoteServiceService} from '../../Service/note-service.service';

@Component({
  selector: 'app-lebel-dialog',
  templateUrl: './lebel-dialog.component.html',
  styleUrls: ['./lebel-dialog.component.scss']
})
export class LebelDialogComponent implements OnInit {
  lebelName: string;
  private lebelList: string[] = [];

  constructor(private noteService: NoteServiceService,
    public dialogRef: MatDialogRef<LebelDialogComponent>
  ) { }

  ngOnInit(): void {
    this.noteService.changeLebelList(this.lebelList);
  }

  onNoClick(lebel: string): void {
    this.lebelList.push(lebel);
    this.noteService.changeLebelList(this.lebelList);
    console.log('current lebel data',lebel);
    console.log('total edit lebel', this.lebelList);
  }


  onCloseDialog(lebelName: string) {
    this.lebelList.push(lebelName);
    this.noteService.changeLebelList(this.lebelList);
    console.log('before close the dialog box', lebelName);
    console.log('total data before closing', this.lebelList);
    this.dialogRef.close();
  }
}
