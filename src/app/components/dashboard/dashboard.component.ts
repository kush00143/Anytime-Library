import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/entity/user';
import { Book } from 'src/app/entity/book';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User;
  bookInfo: Book[][];
  authenticated = false;
  selectValue = true;
  searchText;

  constructor(
    private fireService: FirebaseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.authenticated = this.authService.authenticated;
      if (user) {
        this.fireService.getBooks().subscribe(books => (this.bookInfo = books));
        this.user = user;
      }
    });
  }

  closeFilter() {
    this.searchText = '';
  }
}
