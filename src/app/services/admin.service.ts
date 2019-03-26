import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { DialogBoxComponent } from '../components/dialog-box/dialog-box.component';

@Injectable({
  providedIn: 'root'
})
export class AdminService implements CanActivate {
  constructor(
    private authService: AuthService,
    private dialogBox: MatDialog,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.user$.pipe(
      take(1),
      map(user => (user && user.role.admin ? true : false)),
      tap(isAdmin => {
        if (!isAdmin) {
          this.dialogBox.open(DialogBoxComponent, {
            data: {
              title: 'Access Denied',
              content: 'Only Admin can Access this page.',
              button: false
            }
          });
          this.router.navigate(['']);
        }
      })
    );
  }
}
