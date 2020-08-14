import {Component, Input, OnInit} from '@angular/core';
import {NoteServiceService} from '../utils/note-service.service';
import {crudHttpsCallWithToken, getHttpsCall} from '../utils/utils';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Note} from '../../model/Note';
import {map, shareReplay} from 'rxjs/operators';
import {Label} from '../../model/Label';
import {PinUpinObject} from '../../model/PinUnpinModel';
import {ArchievedObject} from '../../model/ArchievedModel';
import {TrashModel} from '../../model/TrashModel';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LebelDialogComponent} from '../lebel-dialog/lebel-dialog.component';
import {EditNodeComponent} from '../edit-node/edit-node.component';
import {UpadteNote} from '../../model/UpadteNote';
import {ColorDTO} from '../../model/ColorDTO';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})

export class CreateNoteComponent implements OnInit{
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  notes$: Observable<any>;
  createNote$: Observable<any>;
  allNonPinedNote: Note[] = [];
  popup: boolean;
  createNote: FormGroup;
  private token: string;
  isExpanded = false;
  isShowing = false;
  newNote: Note;
  icon_variable_binding: string = 'plus_';
  searchTerm: string;
  allPinedNote: Note[] = [];
  allLebel: Label[] = [];
  allArchivedNote: Note[] = [];

  colorCodes =
    [
      [
        { name: "white", hexcode: "#ffffff" },
        { name: "lightGreen", hexcode: "#f28b82" },
        { name: "purple", hexcode: "#f7bc04" },
        { name: "red", hexcode: "#faf474" },
      ],
      [
        { name: "Teal", hexcode: "#cbff90" },
        { name: "pink", hexcode: "#a7ffeb" },
        { name: "orange", hexcode: "#cbf0f8" },
        { name: "blue", hexcode: "#adcbfa" },
      ],
      [
        { name: "brown", hexcode: "#d7aefb" },
        { name: "yellow", hexcode: "#fdcfe8" },
        { name: "darkBlue", hexcode: "#cbb294" },
        { name: "gray", hexcode: "#e8eaed" }
      ]
    ];
  indexStatus: string;
  labelSearchTerm: any;
  pinStatusDuringCreate: boolean = false;
  currentNode_to_update: Note;

  constructor(private noteService: NoteServiceService,
              public formBuilder: FormBuilder,
              public snack: MatSnackBar,
              public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.getAllNotes();
    this.getAllLabels();
    this.noteService.currentSearch$.subscribe(response => {
      this.searchTerm = response;
    });
    this.noteService.currentLebel$.subscribe((response: Label[]) => {
      this.allLebel = response;
    });
    this.createNote = this.formBuilder.group({
      title: '',
      description: '',
      isPined: false,
    });
  }

  mouseenter(i: string) {
    this.isShowing = true;
    this.indexStatus = i;
  }

  mouseleave() {
    this.isShowing = false;
    this.indexStatus = '';
  }

  onPopup() {
    this.popup = true;
  }

  updateNote(data: Note) {
    const updateNoteDTO: UpadteNote = new UpadteNote();
    updateNoteDTO.noteId = data.id;
    updateNoteDTO.title = data.title;
    updateNoteDTO.description = data.description;
    const resp$ = crudHttpsCallWithToken('/notes/updateNotes?access_token=' + this.token, updateNoteDTO, 'post');
    resp$.subscribe(response => {
      this.snack.open('Note Updated successfully', 'ok', {
        duration: 1500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    });
  }
  note() {
    this.token = localStorage.getItem('token');
    if (this.createNote) {
      const newNote_1: Note = Object.assign(new Note(), this.createNote.value);
      newNote_1.isPined = this.pinStatusDuringCreate;
      this.createNote$ = crudHttpsCallWithToken('/notes/addNotes?access_token=' + this.token, newNote_1, 'post');
      this.createNote$.subscribe((response: any) => {
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

  getAllNotes() {
    this.notes$ = getHttpsCall('/notes/getNotesList?access_token=' + this.token, 'get'), shareReplay();
    this.notes$.subscribe(data => {
      this.notes$.subscribe(notes => {
        this.allNonPinedNote = notes.data.data
          .filter(note => !note.isPined)
          .filter(n => !n.isArchived)
          .filter(v => !v.isDeleted);
        this.allPinedNote = notes.data.data
          .filter(note => note.isPined)
          .filter(n => !n.isArchived)
          .filter(v => !v.isDeleted);
      });
    });
  }
  getAllLabels() {
    const resp$ = getHttpsCall('/noteLabels/getNoteLabelList?access_token='+this.token, 'get');
    resp$.subscribe((ress: any) => {
      this.allLebel = ress.data.details;
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

  pinNote(note: Note, i: number) {
    if (this.allNonPinedNote.length > 0) {
      note.isPined = true;
      const for_pinned: PinUpinObject = new PinUpinObject();
      for_pinned.noteIdList = [note.id];
      for_pinned.isPined = true;
      const resp$ = crudHttpsCallWithToken('/notes/pinUnpinNotes?access_token=' + this.token, for_pinned, 'post');
      resp$.subscribe(response => {
        this.allPinedNote.push(note);
        this.allNonPinedNote.splice(i, 1);
        this.snack.open('Note Pinned Sucessfully', 'ok', {
          duration: 1500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      });
    }
  }

  unpinNote(note: Note, i: number) {
    if (this.allPinedNote.length > 0) {
      note.isPined = false;
      const for_pinned: PinUpinObject = new PinUpinObject();
      for_pinned.noteIdList = [note.id];
      for_pinned.isPined = false;
      const resp$ = crudHttpsCallWithToken('/notes/pinUnpinNotes?access_token=' + this.token, for_pinned, 'post');
      resp$.subscribe(response => {
        this.allNonPinedNote.push(note);
        this.allPinedNote.splice(i, 1);
        this.snack.open('Note UnPinned Sucessfully', 'ok', {
          duration: 1500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      });
    }
  }

  unpinCreateNote() {
    this.pinStatusDuringCreate = !this.pinStatusDuringCreate;
  }

  pinCreateNote() {
    this.pinStatusDuringCreate = !this.pinStatusDuringCreate;
  }

  addToArchive(note: Note, i: number) {
    const for_archieve: ArchievedObject = new ArchievedObject();
    for_archieve.noteIdList = [note.id];
    for_archieve.isArchived = true;

    if ( this.allPinedNote.length > 0 && this.allPinedNote.indexOf(note) > -1) {
      const resp$ = crudHttpsCallWithToken('/notes/archiveNotes?access_token=' + this.token, for_archieve, 'post');
      resp$.subscribe(response => {
        this.allPinedNote.splice(i, 1);
      });
    } else {
      const resp$ = crudHttpsCallWithToken('/notes/archiveNotes?access_token=' + this.token, for_archieve, 'post');
      resp$.subscribe(response => {
        this.allNonPinedNote.splice(i, 1);
      });
    }
    this.snack.open('Note added sucessfully to archive', 'ok', {
      duration: 1500,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  trash(note: Note, i: number) {
    const for_delete: TrashModel = new TrashModel();
    for_delete.noteIdList = [note.id];
    for_delete.isDeleted = true;
    if ( this.allNonPinedNote.length > 0 && this.allPinedNote.indexOf(note) > -1) {
      const resp$ = crudHttpsCallWithToken('/notes/trashNotes?access_token=' + this.token, for_delete, 'post');
      resp$.subscribe(response => {
        this.allPinedNote.splice(i, 1);
      });
    } else {
      const resp$ = crudHttpsCallWithToken('/notes/trashNotes?access_token=' + this.token, for_delete, 'post');
      resp$.subscribe(response => {
        this.allNonPinedNote.splice(i, 1);
      });
    }
    this.snack.open('Note added successfully to Trash', 'ok', {
      duration: 1500,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  editNodeDialogBox(note: Note) {
    this.noteService.passNoteToEditNote(note);
    const dialogRef = this.dialog.open(EditNodeComponent, {
      width: '516px',
      height: 'fit-content',
      data: note,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.updateNote(note);
    });
  }

  add_lebel_to_note(labelTag: Label, note: Note, i: number) {
      const labeList : Label[] = note.noteLabels;
      if(!labeList.includes(labelTag)){
        const res$ = getHttpsCall('/notes/'+note.id+'/addLabelToNotes/'+labelTag.id+'/add?access_token='+this.token, 'post');
        res$.subscribe(console.log);
      }
      if(note.isPined){
        if(this.allPinedNote[i].noteLabels.indexOf(labelTag) === -1){
          this.allPinedNote[i].noteLabels.push(labelTag);
        }
        else{
          this.snack.open("Label Already Assigned",'OK',{
            duration: 1500,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
      else{
        if(this.allNonPinedNote[i].noteLabels.indexOf(labelTag) === -1) {
          this.allNonPinedNote[i].noteLabels.push(labelTag);
        }
        else {
          this.snack.open("Label Already Assigned",'OK',{
            duration: 1500,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
  }

  delete_label_from_note(labelTag: Label, note: Note, i: number, nl: number) {
    const resp$ = getHttpsCall('/notes/'+note.id+'/addLabelToNotes/'+labelTag.id+'/remove?access_token='+this.token, 'post');
    resp$.subscribe((ress: any) => {
      if(note.isPined === true){
        this.allPinedNote[i].noteLabels.splice(nl, 1);
      }
      else {
        this.allNonPinedNote[i].noteLabels.splice(nl, 1);
      }
    });
  }

  changeColor(colorName: string, note: Note, i: number) {
    const colorDto: ColorDTO = new ColorDTO();
    colorDto.noteIdList = [note.id];
    colorDto.color = colorName;
    const resp$ = crudHttpsCallWithToken("/notes/changesColorNotes?access_token="+this.token, colorDto,"post")
      resp$.subscribe(
      (response: any) => {
        if(note.isPined && this.allPinedNote.includes(note)){
          this.allPinedNote[i].color = colorName;
        }else {
          this.allNonPinedNote[i].color = colorName;
        }
        console.log("color is successfully applied", response);
      })
  }
}
