

import { Injectable } from '@angular/core';
import{ environment } from '../../../environments/environment';
import{ HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
baseUrl=environment.baseUrl;
  constructor(private http:HttpClient) {
}

  public POST(url: any, data: any, token): any {
    return this.http.post(this.baseUrl + url, data, token);
  }

}
