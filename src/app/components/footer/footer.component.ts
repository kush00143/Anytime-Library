import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  date: Date;
  constructor() {
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  }

  ngOnInit() {}
}
