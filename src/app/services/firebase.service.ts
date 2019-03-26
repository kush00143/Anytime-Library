import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Book } from '../entity/book';
import { map } from 'rxjs/operators';
import { Likes } from '../entity/likes';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  books: AngularFirestoreCollection<Book[]>;
  comments;

  constructor(private database: AngularFirestore) {}

  getBooks() {
    this.books = this.database.collection('/books', ref =>
      ref.orderBy('title')
    );
    return this.books.valueChanges();
  }

  getBookById(id) {
    return this.database.doc(`/books/${id}`).valueChanges();
  }

  addBookDetails(bookInfo) {
    const uid = bookInfo.isbn;
    const filteredBook = JSON.parse(JSON.stringify(bookInfo));
    return this.database
      .collection('/books')
      .doc(uid)
      .set(filteredBook);
  }

  checkUsersLike(bookId, userId) {
    return this.database
      .collection('/likes', ref => ref.where('bookId', '==', bookId))
      .valueChanges();
  }

  getIssues(userId, bookId) {
    return this.database
      .collection('/issues', ref =>
        ref.where('userId', '==', userId).where('bookId', '==', bookId)
      )
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: any = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  getBookComments(bookId) {
    return (this.comments = this.database
      .collection('/comments', ref =>
        ref.where('bookId', '==', bookId).orderBy('time')
      )
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: any = a.payload.doc.data();
            data.id = a.payload.doc.id;
            this.database
              .collection('/users')
              .doc(data.userId)
              .valueChanges()
              .subscribe(user => (data.user = user));
            return data;
          });
        })
      ));
  }

  addComments(comment) {
    this.database.collection('/comments').add(comment);
  }

  updateRatings(bookId, rating) {
    this.database
      .collection('/books')
      .doc(bookId)
      .update({ ratings: rating });
  }

  deleteComment(id) {
    this.database
      .collection('/comments')
      .doc(id)
      .delete();
  }

  updateUser(user) {
    this.database
      .collection('/users')
      .doc(user.userId)
      .update(user);
  }

  addBookIssue(issue) {
    this.database.collection('/issues').add(issue);
  }

  updateCopies(bookId, bookCount) {
    this.database
      .collection('/books')
      .doc(bookId)
      .update({ count: bookCount });
  }

  updateBookIssue(issue, id) {
    this.database
      .collection('/issues')
      .doc(id)
      .update(issue);
  }

  deleteBookIssue(id) {
    this.database
      .collection('/issues')
      .doc(id)
      .delete();
  }

  updateUserLikes(userId, booksId, option) {
    if (option) {
      const likes: Likes = {
        bookId: booksId,
        userId: {
          [userId]: true
        }
      };
      this.database
        .collection('/likes')
        .doc(booksId)
        .set(likes, { merge: true });
    } else {
      this.database
        .collection('/likes')
        .doc(booksId)
        .update({
          ['userId' + userId]: firebase.firestore.FieldValue.delete()
        });
    }
  }

  deleteBook(id) {
    this.database
      .collection('/books')
      .doc(id)
      .delete();
  }

  checkIssuedBooks(id) {
    return this.database
      .collection('/issues', ref => ref.where('bookId', '==', id))
      .valueChanges();
  }

  getAllIssuedBooks() {
    return this.database
      .collection('/issues')
      .snapshotChanges()
      .pipe(
        map(ref => {
          return ref.map(actions => {
            const data: any = actions.payload.doc.data();
            data.id = actions.payload.doc.id;

            this.database
              .collection('/users')
              .doc(data.userId)
              .valueChanges()
              .subscribe(user => {
                data.user = user;
              });
            this.database
              .collection('/books')
              .doc(data.bookId)
              .valueChanges()
              .subscribe(book => {
                data.book = book;
              });
            return data;
          });
        })
      );
  }

  getAllUsers() {
    return this.database.collection('/users').valueChanges();
  }

  getUserById(id) {
    return this.database.doc(`/users/${id}`).valueChanges();
  }

  getIssueByUser(userId) {
    return this.database
      .collection('/issues', ref => ref.where('userId', '==', userId))
      .snapshotChanges()
      .pipe(
        map(ref => {
          return ref.map(actions => {
            const data: any = actions.payload.doc.data();
            data.id = actions.payload.doc.id;
            this.database
              .collection('/books')
              .doc(data.bookId)
              .valueChanges()
              .subscribe(book => {
                data.book = book;
              });
            return data;
          });
        })
      );
  }

  getUserIssues(userId) {
    return this.database
      .collection('/issues', ref => ref.where('userId', '==', userId))
      .valueChanges();
  }

  deleteUser(id) {
    this.database
      .collection('/users')
      .doc(id)
      .delete();
  }

  updateBook(bookInfo) {
    const uid = bookInfo.isbn;
    const filteredBook = JSON.parse(JSON.stringify(bookInfo));
    return this.database
      .collection('/books')
      .doc(uid)
      .update(filteredBook);
  }
}
