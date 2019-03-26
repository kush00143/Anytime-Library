import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { Issue } from 'src/app/entity/issue';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  issuedBooks;
  books;
  users;
  userInfo;

  constructor(
    private fireService: FirebaseService,
    private authServivce: AuthService,
    private dialogBox: MatDialog,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.fireService
      .getAllIssuedBooks()
      .subscribe(issues => (this.issuedBooks = issues));
    this.fireService.getAllUsers().subscribe(users => (this.users = users));
    this.fireService.getBooks().subscribe(books => (this.books = books));
  }
  // delete User
  deleteUser(user) {
    this.authServivce.user$.pipe(take(1)).subscribe(loggedUser => {
      if (user.userId === loggedUser.userId) {
        this.dialogBox.open(DialogBoxComponent, {
          data: {
            title: 'Error',
            content: 'You are deleting yourself !! LOL',
            button: false
          }
        });
      } else {
        this.fireService
          .getUserIssues(user.userId)
          .pipe(take(1))
          .subscribe(issues => {
            let issued = false;
            if (issues.length !== 0) {
              issued = true;
            }

            if (!issued) {
              const contents =
                'Are you sure to delete the user :' +
                user.userId +
                ' with Name : ' +
                user.name +
                '?';
              const dialogRef = this.dialogBox.open(DialogBoxComponent, {
                data: {
                  title: 'Delete User',
                  content: contents,
                  button: true
                }
              });
              dialogRef.componentInstance.onAdd.subscribe(() => {
                this.fireService.deleteUser(user.userId);
                dialogRef.close();
                this.dialogBox.open(DialogBoxComponent, {
                  data: {
                    title: 'Success',
                    content: 'User has been deleted',
                    button: false
                  }
                });
              });
            } else {
              this.dialogBox.open(DialogBoxComponent, {
                data: {
                  title: 'Error',
                  content:
                    'User has issued books. Return those books and try again',
                  button: false
                }
              });
            }
          });
      }
    });
  }

  // delete Books
  deleteBook(book) {
    this.firebaseService
      .checkIssuedBooks(book.isbn)
      .pipe(take(1))
      .subscribe(issuedBooks => {
        if (issuedBooks.length !== 0) {
          this.dialogBox.open(DialogBoxComponent, {
            data: {
              title: 'Error',
              content:
                'Book is already issued to users. You can not delete it.',
              button: false
            }
          });
        } else {
          const contents =
            'Are you sure to delete the book: ' +
            book.title +
            ' (' +
            book.isbn +
            '). ?';
          const dialogRef = this.dialogBox.open(DialogBoxComponent, {
            data: {
              title: 'Delete Book',
              content: contents,
              button: true
            }
          });
          dialogRef.componentInstance.onAdd.subscribe(() => {
            this.firebaseService.deleteBook(book.isbn);
            dialogRef.close();
            this.dialogBox.open(DialogBoxComponent, {
              data: {
                title: 'Success',
                content: 'Book has been deleted',
                button: false
              }
            });
          });
        }
      });
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
      issue.user.bookcount += 1;
      this.firebaseService.deleteBookIssue(issue.id);
      this.firebaseService.updateUser(issue.user);
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
