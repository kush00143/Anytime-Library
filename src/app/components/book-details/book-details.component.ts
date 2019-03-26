import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/entity/user';
import { Comment } from 'src/app/entity/comment';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { Issue } from 'src/app/entity/issue';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  bookInfo;
  comments;
  commentsLength: 0;
  badgeVisible = false;
  user: User;
  admin = false;
  issued = false;
  liked = false;
  likeCount;
  bookLikes;
  comment: Comment = {
    bookId: null,
    description: null,
    time: null,
    userId: null,
    ratings: null
  };

  issuedBook: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private dialogBox: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.authService.user$.subscribe(user => {
        this.user = user;
        this.admin = user.role.admin;
        this.firebaseService
          .checkUsersLike(data.id, this.user.userId)
          .subscribe(likes => {
            const userLikes: any = likes[0];
            if (userLikes) {
              this.likeCount = Object.keys(userLikes.userId).length;
              const usersString: string = JSON.stringify(userLikes.userId);
              if (usersString.indexOf(user.userId) > 0) {
                this.liked = true;
              } else {
                this.liked = false;
              }
            } else {
              this.likeCount = 0;
            }
          });
        this.firebaseService
          .getIssues(this.user.userId, data.id)
          .subscribe(issueData => {
            if (issueData.length) {
              this.issued = true;
              this.issuedBook = issueData[0].id;
            }
          });
      });
      this.firebaseService.getBookById(data.id).subscribe(bookData => {
        this.bookInfo = bookData;
      });
      this.firebaseService.getBookComments(data.id).subscribe(comments => {
        this.comments = comments;
        this.commentsLength = this.comments.length;
        if (this.commentsLength > 0) {
          this.badgeVisible = true;
        } else {
          this.badgeVisible = false;
        }
      });
    });
  }

  goBack(): void {
    this.location.back();
  }

  // Update Book
  updateBook(id: number): void {
    this.router.navigate(['/update-book', id]);
  }

  // submit Comments
  submitComments() {
    this.comment.userId = this.user.userId;
    this.comment.bookId = this.bookInfo.isbn;
    this.comment.time = new Date();
    this.updateRatings(this.comment.ratings);
    this.firebaseService.addComments(this.comment);
    this.comment = {
      description: null,
      ratings: null
    };
  }

  updateRatings(rating) {
    const rate = (rating * 1.0 + this.bookInfo.ratings * 1.0) / 2;
    this.firebaseService.updateRatings(this.bookInfo.isbn, rate.toFixed(1));
  }

  // issue Books
  issueBook() {
    if (this.bookInfo.count > 0) {
      const contents =
        'Are you sure to issue this book to book titled ' +
        this.bookInfo.title +
        ' with your ID ?';
      const dialogRef = this.dialogBox.open(DialogBoxComponent, {
        data: {
          title: 'Issue Book',
          content: contents,
          button: true
        }
      });
      dialogRef.componentInstance.onAdd.subscribe(() => {
        if (this.user.bookcount) {
          this.user.bookcount -= 1;
          const bookIssue: Issue = {
            userId: this.user.userId,
            bookId: this.bookInfo.isbn,
            issueDate: new Date()
          };
          this.firebaseService.updateUser(this.user);
          this.firebaseService.addBookIssue(bookIssue);
          this.firebaseService.updateCopies(
            this.bookInfo.isbn,
            this.bookInfo.count - 1
          );
          this.issued = true;
          dialogRef.close();
          this.dialogBox.open(DialogBoxComponent, {
            data: {
              title: 'Success',
              content: 'Book has been issued',
              button: false
            }
          });
        } else {
          this.dialogBox.open(DialogBoxComponent, {
            data: {
              title: 'Error',
              content:
                'Maximum issue book limit is reached, Return some book first',
              button: false
            }
          });
        }
      });
    } else {
      this.dialogBox.open(DialogBoxComponent, {
        data: {
          title: 'Error',
          content:
            'All copies are issued, Let someone Return it first',
          button: false
        }
      });
    }
  }

  // renew Books
  renewBook() {
    const contents =
      'The book titled ' +
      this.bookInfo.title +
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
        userId: this.user.userId,
        bookId: this.bookInfo.isbn,
        issueDate: new Date()
      };
      bookIssue.issueDate = new Date();
      this.firebaseService.updateBookIssue(bookIssue, this.issuedBook);
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
  returnBook() {
    const contents =
      'Your book titled ' + this.bookInfo.title + ' will be returned...';
    const dialogRef = this.dialogBox.open(DialogBoxComponent, {
      data: {
        title: 'Return Book',
        content: contents,
        button: true
      }
    });
    dialogRef.componentInstance.onAdd.subscribe(() => {
      this.user.bookcount += 1;
      this.firebaseService.deleteBookIssue(this.issuedBook);
      this.firebaseService.updateUser(this.user);
      this.firebaseService.updateCopies(
        this.bookInfo.isbn,
        this.bookInfo.count + 1
      );
      this.issued = false;
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

  // delete comments
  deleteComment(id) {
    this.firebaseService.deleteComment(id);
  }

  // delete Books
  deleteBook() {
    this.firebaseService
      .checkIssuedBooks(this.bookInfo.isbn)
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
            this.bookInfo.title +
            ' (' +
            this.bookInfo.isbn +
            '). ?';
          const dialogRef = this.dialogBox.open(DialogBoxComponent, {
            data: {
              title: 'Delete Book',
              content: contents,
              button: true
            }
          });
          dialogRef.componentInstance.onAdd.subscribe(() => {
            this.firebaseService.deleteBook(this.bookInfo.isbn);
            dialogRef.close();
            this.dialogBox.open(DialogBoxComponent, {
              data: {
                title: 'Success',
                content: 'Book has been deleted',
                button: false
              }
            });
            this.router.navigate(['']);
          });
        }
      });
  }

  // like Books
  likeBook(liked) {
    if (!liked) {
      this.likeCount = this.likeCount + 1;
      this.firebaseService.updateUserLikes(
        this.user.userId,
        this.bookInfo.isbn,
        true
      );
      this.liked = true;
    } else {
      this.likeCount = this.likeCount - 1;
      this.firebaseService.updateUserLikes(
        this.user.userId,
        this.bookInfo.isbn,
        true
      );
      this.liked = false;
    }
  }
  // share Books

  shareBook(coverUrl) {
    this.dialogBox.open(DialogBoxComponent, {
      data: {
        title: 'share',
        content: 'Share this book via Social Media',
        button: false,
        image: coverUrl
      }
    });
  }

  // trimRatings
  trimRating(ratingInput: number) {
    if (ratingInput > 5) {
      this.comment.ratings = 5;
    }
  }
}
