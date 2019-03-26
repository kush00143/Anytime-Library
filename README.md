## AnytimeLibraryApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.1. using Google Firebase for authentication and firestore for database

Live Demo at : https://anytimelibrary-a79ac.firebaseapp.com

## Explaination of project

This is a Library application which can perform below actions.

=> Issue book, renew book and return book.

=> Share the book via social media

=> Like the book, rate the book and post comments/reviews of the book and more...

=> Admin user can add new book and can modify the logged in user details and book details.


## How to make yourself as Admin?
click on profile -> edit profile -> check admin option and save. Congrats you are an admin now:)

## Version Info
Angular CLI: 7.3.5

Node: 10.15.1

Angular: 7.2.8

... animations, common, compiler, compiler-cli, core, forms

... language-service, platform-browser, platform-browser-dynamic

... router

Package ========================= Version

@angular-devkit/architect ======= 0.13.5

@angular-devkit/build-angular === 0.13.5

@angular-devkit/build-optimizer = 0.13.5

@angular-devkit/build-webpack === 0.13.5

@angular-devkit/core ============ 7.3.5

@angular-devkit/schematics ====== 7.3.5

@angular/cdk ==================== 7.3.4

@angular/cli ==================== 7.3.5

@angular/fire =================== 5.1.1

@angular/material ==============  7.3.3

@ngtools/webpack ================ 7.3.5

@schematics/angular ============= 7.3.5

@schematics/update ============== 0.13.5

rxjs ============================ 6.3.3

typescript ====================== 3.2.4

webpack ========================= 4.29.0


## Official Documentation of how to use every component/feature.
	#Angular: https://angular.io/docs
	#bootstrap v4: https://getbootstrap.com/docs/4.0/getting-started/introduction/
	#Material design: https://material.angular.io/components/categories
	#Font Awesome: https://fontawesome.com/icons
-----------------------------------------------------------------------------------

## User Role

User role will be :- 

 Able to search for a book using Author or Title

 View Book details like Author, Title, Thumbnail image, ISBN, Description

 Issue the book to self, depending on the availability

 Renew the book once for configured days

 Return read book and review & rate the same

 Display list of books with the user along with details like ‘Renew / Return by’ date-time

 There is a limit on no. [20] of books which can be taken which is configurable

 Social features like

  => o Like & rate books

  => o Review & recommend books to friends

 Display user profile including picture, social ids, name, friends


## Admin Role

Admin role will be able to:- 

 Add / Update (including no. of copies) / Delete books

 Add using ISBN entering the code manually

 Retrieve book details using ISBN through any public apis. Details include title, author,

description, social rating through goodreads or google or any other sources

 Allow admin to enter the details manually When book details are not available through public api.

 Display the list of books taken by users and filter by book title, book author, user id, user name, issued date

 Sort the above list by issued date, book title, book author, user name


=======================================================

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
