import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() {
  }

  public setCollection(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getCollection(key: string) {
    return localStorage.getItem(key);
  }

}
