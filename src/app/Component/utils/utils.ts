import {Observable} from 'rxjs';

export function getHttpsCall(url: string){
  let baseUrl: string = 'http://fundoonotes.incubation.bridgelabz.com/api';
  url = baseUrl + url;
  return new Observable(observer => {
        fetch(url,{
          method: 'GET',
          headers:{
            'Content-Type': 'application/json'
          }
        })
          .then(datas => {
            return datas.json();
          })
          .then( body => {
            observer.next(body);
            console.log('api call', body);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      });
}

export function crudHttpsCallWithToken(url: string, bodyData: any, methodType: string){
  let baseUrl: string = 'http://fundoonotes.incubation.bridgelabz.com/api';
  url = baseUrl + url;
  return new Observable(observer => {
        fetch(url,
          {
            method: methodType.toUpperCase(),
            body: JSON.stringify(bodyData),
            headers: {
              'Content-Type': 'application/json'
            }
          }
          )
          .then(datas => {
            return datas.json();
          })
          .then( body => {
            observer.next(body);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      });
}
