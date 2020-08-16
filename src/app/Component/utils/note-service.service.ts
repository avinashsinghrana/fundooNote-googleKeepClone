import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Label} from '../../model/Label';
import {HttpService} from '../../Service/httpService/http.service';
import {Note} from '../../model/Note';
import {DataServiceModel} from '../../model/DataServiceModel';
import {mergeScan} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoteServiceService {

  private loginSource = new Subject<any>();
  currentLoginStatus$ = this.loginSource.asObservable();
  private noteSource = new Subject<Note>();
  currentNotes$ = this.noteSource.asObservable();
  private searchSource = new Subject<string>();
  currentSearch$ = this.searchSource.asObservable();
  private lebelSource = new BehaviorSubject<Label[]>([]);
  currentLebel$ = this.lebelSource.asObservable();
  private labelSearchSource = new Subject<string>();
  currentLabelTerm$ = this.labelSearchSource.asObservable();
  private archiveSorce = new Subject<Note[]>();
  currentArchievedData$ = this.archiveSorce.asObservable();
  private labelNameSource = new Subject<string>();
  currentRequestLabelName$ = this.labelNameSource.asObservable();
  private updateSource = new Subject();
  currentUpdateNote$ = this.updateSource.asObservable();
  private noteMethodSource = new Subject<DataServiceModel>();
  currentNoteMethod$ = this.noteMethodSource.asObservable();
  private pinSource = new Subject<DataServiceModel>();
  currentNoteToPin$ = this.pinSource.asObservable();
  private unPinSource = new Subject<DataServiceModel>();
  currentNoteToUnpin$ = this.unPinSource.asObservable();
  private trashSource = new Subject<DataServiceModel>();
  currentNoteToTrash$ = this.trashSource.asObservable();
  private archiveSource = new Subject<DataServiceModel>();
  currentNoteToArchived$ = this.archiveSorce.asObservable();
  private editNoteSource = new Subject<DataServiceModel>();
  currentEditNote$ = this.editNoteSource.asObservable();
  private labelToNoteSource = new Subject<DataServiceModel>();
  currentLabelToNote$ = this.labelToNoteSource.asObservable();

  constructor(private http: HttpClient) {
  }

  changeLoginStatus(message: any) {
    this.loginSource.next(message);
  }

  changeEvent(searchTerm: string) {
    this.searchSource.next(searchTerm);
  }

  changeLabelEvent(searchTerm: string) {
    this.labelSearchSource.next(searchTerm);
  }

  changeLebelList(message: Label[]) {
    this.lebelSource.next(message);
  }

  profilePic(token: any, formData: FormData): any {
    return this.http.post('http://fundoonotes.incubation.bridgelabz.com/api/user/uploadProfileImage?access_token=' + token, formData, {headers: new HttpHeaders().set('token', localStorage.getItem('token'))});
  }

  changeInArchive(archiveData: Note[]) {
    this.archiveSorce.next(archiveData);
  }

  changeLabelRequest(labelName: string) {
    this.labelNameSource.next(labelName);
  }

  passNoteToEditNote(note: Note) {
    this.noteSource.next(note);
  }

  updateNoteFromEditNote(updated_note: Note) {
    this.updateSource.next(updated_note);
  }

  calling_method_observer(message: any) {
    this.noteMethodSource.next(message);
  }

  calling_method_unpinNote(dataServiceModel: DataServiceModel) {
    this.pinSource.next(dataServiceModel);
  }

  calling_method_pinNote(dataServiceModel: DataServiceModel) {
    this.unPinSource.next(dataServiceModel);
  }

  calling_method_EditNode(dataServiceModel: DataServiceModel) {
    this.editNoteSource.next(dataServiceModel);
  }


  calling_method_Delete_label_Note(dataServiceModel: DataServiceModel) {
    this.trashSource.next(dataServiceModel);
  }

  calling_method_AddToArchive(dataServiceModel: DataServiceModel) {
    this.archiveSource.next(dataServiceModel);
  }


  calling_method_AddToTrash(dataServiceModel: DataServiceModel) {
    this.trashSource.next(dataServiceModel);
  }

  calling_method_addLabelToNote(dataServiceModel: DataServiceModel) {
  }

  changelabelToNoteSource(dataServiceModel: DataServiceModel) {
    this.labelToNoteSource.next(dataServiceModel);
  }
}

