import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
    <p class="spinner">
      <img src="assets/img/books.gif">
    </p>
  `,
  styles: []
})
export class SpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
