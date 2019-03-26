import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { MatDialog } from '@angular/material';
import { Issue } from 'src/app/entity/issue';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userInfo;
  issuedBooks;
  editProfile = false;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private dialogBox: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.firebaseService
        .getUserById(data.id)
        .subscribe(user => (this.userInfo = user));
      this.firebaseService
        .getIssueByUser(data.id)
        .subscribe(issues => (this.issuedBooks = issues));
    });
  }

  updateUser() {
    this.firebaseService.updateUser(this.userInfo);
    this.editProfile = false;
  }

  // renew Books
  renewBook(issue) {
    const contents =
      'The book titled ' +
      issue.book.title +
      ' will be renewed for 10 more days.';
    const dialogRef = this.dialogBox.open(DialogBoxComponent, {
      data: {
        title: 'Renew Book',
        content: contents,
        button: true
      }
    });
    dialogRef.componentInstance.onAdd.subscribe(() => {
      const bookIssue: Issue = {
        userId: issue.userId,
        bookId: issue.bookId,
        issueDate: new Date()
      };
      bookIssue.issueDate = new Date();
      this.firebaseService.updateBookIssue(bookIssue, issue.id);
      dialogRef.close();
      this.dialogBox.open(DialogBoxComponent, {
        data: {
          title: 'Success',
          content: 'Book has been renewed for 10 more days',
          button: false
        }
      });
    });
  }

  // return Books
  returnBook(issue) {
    const contents =
      'Your book titled ' + issue.book.title + ' will be returned...';
    const dialogRef = this.dialogBox.open(DialogBoxComponent, {
      data: {
        title: 'Return Book',
        content: contents,
        button: true
      }
    });
    dialogRef.componentInstance.onAdd.subscribe(() => {
      this.userInfo.bookcount += 1;
      this.firebaseService.deleteBookIssue(issue.id);
      this.firebaseService.updateUser(this.userInfo);
      this.firebaseService.updateCopies(issue.bookId, issue.book.count + 1);
      dialogRef.close();
      this.dialogBox.open(DialogBoxComponent, {
        data: {
          title: 'Success',
          content: 'Book has been returned',
          button: false
        }
      });
    });
  }

  getDifference(currDate) {
    const diffTime =
      (currDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return 10 - Math.round(Math.abs(diffTime));
  }
}
