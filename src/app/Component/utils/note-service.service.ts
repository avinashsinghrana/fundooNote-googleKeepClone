import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Label} from '../../model/Label';
import {HttpService} from '../../Service/httpService/http.service';
import {Note} from '../../model/Note';

@Injectable({
  providedIn: 'root'
})
export class NoteServiceService {

  private loginSource = new Subject<any>();
  currentLoginStatus$ = this.loginSource.asObservable();
  private noteSource = new Subject<any>();
  currentNotes$ = this.noteSource.asObservable();
  public searchSource = new Subject<string>();
  currentSearch$ = this.searchSource.asObservable();
  public lebelSource = new BehaviorSubject<Label[]>([]);
  currentLebel$ = this.loginSource.asObservable();
  private labelSearchSource = new Subject<string>();
  currentLabelTerm$ = this.labelSearchSource.asObservable();
  private archiveSorce = new Subject<Note[]>();
  currentArchievedData$ = this.archiveSorce.asObservable();
  private labelNameSource = new Subject<string>();
  currentRequestLabelName$ = this.labelNameSource.asObservable();


  constructor(private http: HttpClient) {
  }

  changeLoginStatus(message: any) {
    this.loginSource.next(message);
  }

  changeNotes(message: any){
    this.noteSource.next(message);
  }

  changeEvent(searchTerm: string) {
    this.searchSource.next(searchTerm);
  }
  changeLabelEvent(searchTerm: string) {
    this.labelSearchSource.next(searchTerm);
  }

  changeLebelList(message: Label[]){
    this.lebelSource.next(message);
  }

  profilePic(token: any, formData: FormData): any {
    return this.http.post('http://fundoonotes.incubation.bridgelabz.com/api/user/uploadProfileImage?access_token='+token, formData, {headers: new HttpHeaders().set('token', localStorage.getItem('token'))});
  }

  changeInArchive(archiveData: Note[]) {
    this.archiveSorce.next(archiveData);
  }

  changeLabelRequest(labelName: string){
    this.labelNameSource.next(labelName);
  }
}

