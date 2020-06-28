import { Injectable } from '@angular/core';
import { HttpService } from '../httpService/http.service';
import{HttpHeaders}from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private httpService: HttpService) { }

signup(data){
  var token='';
  return this.httpService.POST('/user/userSignUp', data, token)
    }
  }