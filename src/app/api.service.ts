import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Number } from './models/base';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public numberUrl: string = "assets/data/number.json";

  constructor(public http: HttpClient) { }

    //Get Numbers list
    getNumbers() {
      return new Promise<Number[]>(resolve => {
        this.http.get(this.numberUrl)
          .subscribe((res: any) => {
            resolve(res);
          }, err => {
            console.log(err);
          });
      });
    }
}
