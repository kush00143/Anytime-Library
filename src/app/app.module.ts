import { BrowserModule } from '@angular/platform-browser';
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminService } from './services/admin.service';
import { AddBookComponent } from './components/add-book/add-book.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { FirebaseService } from './services/firebase.service';
import { GoogleBookService } from './services/google-book.service';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { FilterPipe } from './modules/filter.pipe';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    ProfileComponent,
    LoginComponent,
    DialogBoxComponent,
    AdminComponent,
    AddBookComponent,
    PageNotFoundComponent,
    BookDetailsComponent,
    EditBookComponent,
    FilterPipe,
    SpinnerComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(
      environment.firebase,
      'angular-auth-firebase'
    ),
    AngularFireDatabaseModule,
    AngularFirestoreModule.enablePersistence(),
    FormsModule,
    ReactiveFormsModule,
    ShareButtonsModule.withConfig({
      debug: true
    })
  ],
  entryComponents: [LoginComponent, DialogBoxComponent],
  providers: [AuthService, AdminService, FirebaseService, GoogleBookService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {}
