import { Component } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Router, NavigationExtras } from '@angular/router';
import { Number } from '../models/base';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  numbers: Number[];

  constructor(private apiService: ApiService,
    private router: Router) {
    this.apiService.getNumbers().then((response) => {
      this.numbers = response;
    })
  }

  ngOnInit() { }

  gotoDraw(item: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        draw: item,
        isColoring: false
      }
    };
    this.router.navigate(['draw'], navigationExtras);
  }

}
