import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GoogleBookService {
  constructor(private http: HttpClient) {}

  getAPIData(isbn) {
    return this.http.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );
  }
}
