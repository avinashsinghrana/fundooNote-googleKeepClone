import { Injectable } from '@angular/core';
import { HttpService } from '../httpService/http.service';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {

  constructor(private httpService: HttpService) { }

  send(data){
    var token='';
    return this.httpService.POST('/user/reset', data, token)
  }
}
