import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { CanReadService } from './services/can-read.service';
import { AddBookComponent } from './components/add-book/add-book.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminService } from './services/admin.service';
import { EditBookComponent } from './components/edit-book/edit-book.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [CanReadService]
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'add-book',
    component: AddBookComponent,
    canActivate: [AdminService]
  },
  {
    path: 'book-details/:id',
    component: BookDetailsComponent,
    canActivate: [CanReadService]
  },
  { path: 'admin', component: AdminComponent, canActivate: [AdminService] },
  {
    path: 'edit-book/:id',
    component: EditBookComponent,
    canActivate: [AdminService]
  },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
