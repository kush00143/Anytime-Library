import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/entity/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  authenticated = false;
  admin = false;
  user: User;
  isLoggedIn: Observable<boolean>;

  constructor(
    public dailog: MatDialog,
    public authService: AuthService,
    private router: Router
  ) {
    this.isLoggedIn = authService.isLoggedIn();
  }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.authenticated = this.authService.authenticated;
      if (user) {
        this.user = user;
        this.admin = user.role.admin;
      }
    });
  }

  openDialog() {
    const dailogRef = this.dailog.open(LoginComponent, {
      width: '250px'
    });

    dailogRef.afterClosed().subscribe(result => {
      console.log(`Dailog result: ${result}`);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
