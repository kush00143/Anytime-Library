import { Component, OnInit } from '@angular/core';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { MatDialog } from '@angular/material';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss']
})
export class EditBookComponent implements OnInit {
  id;
  bookInfo;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogBox: MatDialog,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.id = data.id;
      this.firebaseService
        .getBookById(data.id)
        .subscribe(bookData => (this.bookInfo = bookData));
    });
  }

  trimRating(ratingInput: number) {
    if (ratingInput > 5) {
      this.bookInfo.ratings = 5;
    }
  }

  trimCount(countInput: number) {
    if (countInput > 100) {
      this.bookInfo.count = 100;
    }
  }

  updateBook() {
    this.firebaseService.updateBook(this.bookInfo);
    this.dialogBox.open(DialogBoxComponent, {
      data: {
        title: 'Success',
        content: 'Book is successfully modified.',
        button: false
      }
    });
    this.router.navigate(['book-details/' + this.id]);
  }
}
