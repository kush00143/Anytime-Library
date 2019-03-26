import { Component, OnInit } from '@angular/core';
import { GoogleBookService } from 'src/app/services/google-book.service';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { Book } from 'src/app/entity/book';
import { take } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {
  isbn: number;
  errMsg: string;
  bookForm: FormGroup;

  bookInfo: Book = {
    title: null,
    isbn: null,
    author: null,
    categories: null,
    publisher: null,
    year: null,
    ratings: null,
    coverUrl: null,
    description: null
  };

  constructor(
    private googleBookService: GoogleBookService,
    private dialogBox: MatDialog,
    private fb: FormBuilder,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.createForms();
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

  validate() {
    this.errMsg = null;
    if (
      this.bookInfo.title &&
      this.bookInfo.isbn &&
      this.bookInfo.author &&
      this.bookInfo.categories &&
      this.bookInfo.publisher &&
      this.bookInfo.ratings &&
      this.bookInfo.year &&
      this.bookInfo.location &&
      this.bookInfo.count &&
      this.bookInfo.coverUrl &&
      this.bookInfo.description
    ) {
      this.addBookDetails();
    } else {
      this.dialogBox.open(DialogBoxComponent, {
        data: {
          title: 'Error',
          content: 'Please enter values to all the fields !!',
          button: false
        }
      });
      this.errMsg = 'Please enter values to all the fields !!';
    }
  }

  addBookDetails() {
    this.errMsg = null;
    this.firebaseService
      .getBookById(this.bookInfo.isbn)
      .pipe(take(1))
      .subscribe(data => {
        if (null != data) {
          this.dialogBox.open(DialogBoxComponent, {
            data: {
              title: 'Error',
              content: 'Book is already present. Please modify the details',
              button: false
            }
          });
          this.errMsg = 'Book is already present. Please modify the details';
        } else {
          this.firebaseService.addBookDetails(this.bookInfo);
          this.dialogBox.open(DialogBoxComponent, {
            data: {
              title: 'Success',
              content: 'Book is successfully added to Library.',
              button: false
            }
          });
          this.bookInfo = {
            author: null,
            categories: null,
            coverUrl: null,
            description: null,
            isbn: null,
            publisher: null,
            ratings: null,
            year: null,
            title: null
          };
        }
      });
  }

  searchBookIsbn(isbn) {
    isbn = isbn.toString();
    this.errMsg = null;
    if (isbn.length > 4 && isbn.length < 14) {
      this.googleBookService.getAPIData(isbn).subscribe(data => {
        const results = JSON.parse(JSON.stringify(data));
        if (results.totalItems === 0) {
          this.dialogBox.open(DialogBoxComponent, {
            data: {
              title: 'Error',
              content:
                'No books with isbn: ' +
                isbn +
                ' is found. Please add Manually',
              button: false
            }
          });
          this.errMsg =
            'No books with isbn: ' + isbn + ' is found. Please add Manually';
        } else {
          results.items.forEach(book => {
            if (book.volumeInfo.industryIdentifiers[0].identifier) {
              if (
                book.volumeInfo.industryIdentifiers[0].identifier ==
                  this.isbn ||
                book.volumeInfo.industryIdentifiers[1].identifier == this.isbn
              ) {
                this.bookInfo = {
                  title: book.volumeInfo.title ? book.volumeInfo.title : '',
                  isbn:
                    book.volumeInfo.industryIdentifiers[0].type == 'ISBN_13'
                      ? book.volumeInfo.industryIdentifiers[0].identifier
                      : book.volumeInfo.industryIdentifiers[1].identifier,
                  author: book.volumeInfo.authors
                    ? book.volumeInfo.authors.toString()
                    : '',
                  categories: book.volumeInfo.categories
                    ? book.volumeInfo.categories.toString()
                    : '',
                  publisher: book.volumeInfo.publisher
                    ? book.volumeInfo.publisher
                    : '',
                  year: book.volumeInfo.publishedDate
                    ? book.volumeInfo.publishedDate
                    : '',
                  ratings: book.volumeInfo.averageRating
                    ? book.volumeInfo.averageRating
                    : '',
                  coverUrl: book.volumeInfo.imageLinks.smallThumbnail
                    ? book.volumeInfo.imageLinks.smallThumbnail
                    : '',
                  description: book.volumeInfo.description
                    ? book.volumeInfo.description
                    : ''
                };
              }
            }
          });
        }
      });
    } else {
      this.dialogBox.open(DialogBoxComponent, {
        data: {
          title: 'Error',
          content: 'Please enter proper ISBN. Ranges -> (5-13)',
          button: false
        }
      });
      this.errMsg = 'Please enter proper ISBN. Ranges -> (5-13)';
    }
    isbn = this.isbn.toString();
    isbn = '';
  }

  createForms() {
    this.bookForm = this.fb.group({
      title: [this.bookInfo.title, Validators.required],
      isbn: [
        this.bookInfo.isbn,
        [
          Validators.required,
          Validators.minLength(13),
          Validators.maxLength(13)
        ]
      ],
      author: [this.bookInfo.author, Validators.required],
      categories: [this.bookInfo.categories, Validators.required],
      publisher: [this.bookInfo.publisher, Validators.required],
      year: [this.bookInfo.year, Validators.required],
      ratings: [this.bookInfo.ratings, Validators.required],
      coverUrl: [this.bookInfo.coverUrl, Validators.required],
      description: [this.bookInfo.description, Validators.required],
      location: [this.bookInfo.location, Validators.required],
      count: [this.bookInfo.count, Validators.required]
    });
  }
}
