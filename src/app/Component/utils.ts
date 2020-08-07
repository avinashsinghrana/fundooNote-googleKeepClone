import {Observable} from 'rxjs';

export function getHttpsCall(url: string){
  return new Observable(observer => {
        fetch(url)
          .then(datas => {
            return datas.json();
          })
          .then( body => {
            observer.next(body.data.data);
            console.log('api call', body.data.data);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      });
}

export function crudHttpsCallWithToken(url: string){
  return new Observable(observer => {
        fetch(url)
          .then(datas => {
            return datas.json();
          })
          .then( body => {
            observer.next(body.data);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      });
}
