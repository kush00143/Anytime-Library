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
import { tap, map, take } from 'rxjs/operators';
import { DialogBoxComponent } from '../components/dialog-box/dialog-box.component';

@Injectable({
  providedIn: 'root'
})
export class CanReadService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private dailogBox: MatDialog
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.user$.pipe(
      take(1),
      map(user => (user && this.authService.canRead(user) ? true : false)),
      tap(canView => {
        if (!canView) {
          this.dailogBox.open(DialogBoxComponent, {
            data: {
              title: 'Access Denied',
              content: 'You Need To Be Logged In.',
              button: false
            }
          });
          this.router.navigate(['']);
        }
      })
    );
  }
}
