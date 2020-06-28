import { HttpService } from '../httpService/http.service';
import { Injectable } from '@angular/core';
import{HttpHeaders}from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpService: HttpService) { }
    login(data){
    var token='';
    return this.httpService.POST('/user/login', data, token)
  }
}
