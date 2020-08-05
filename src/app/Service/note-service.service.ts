import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteServiceService {

  private loginSource = new Subject<any>();
  currentLoginStatus$ = this.loginSource.asObservable();


  constructor() { }

  changeLoginStatus(message: any){
    this.loginSource.next(message);
  }
}
