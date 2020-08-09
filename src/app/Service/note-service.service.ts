import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpService} from './httpService/http.service';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoteServiceService {

  private loginSource = new Subject<any>();
  currentLoginStatus$ = this.loginSource.asObservable();
  private noteSource = new Subject<any>();
  currentNotes$ = this.noteSource.asObservable();
  private searchSource = new Subject<string>();
  currentSearch$ = this.searchSource.asObservable();
  private lebelSource = new Subject<string[]>();
  currentLebelList$ = this.loginSource.asObservable();


  constructor(private httpService: HttpService) {
  }

  changeLoginStatus(message: any) {
    this.loginSource.next(message);
  }

  changeNotes(message: any){
    this.noteSource.next(message);
  }

  note(data: any, token: any) {
    const formData: FormData = new FormData();
    return this.httpService.POST('/notes/addNotes?access_token=' + token, data, {headers: new HttpHeaders().set('token', localStorage.getItem('token'))});
  }

  GetAllNotes(token: string) {
    return this.httpService.GET('/notes/getNotesList?access_token='+ token);

  }

  changeEvent(searchTerm: string) {
    this.searchSource.next(searchTerm);
  }

  changeLebelList(message: string[]){
    this.lebelSource.next(message);
  }
}

