import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  terms = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  signInWithGoogle() {
    this.authService.googleSignIn();
    this.router.navigate(['']);
  }

  signInWithGithub() {
    this.authService.githubSignIn();
    this.router.navigate(['']);
  }

  signInWithTwitter() {
    this.authService.twitterSignIn();
    this.router.navigate(['']);
  }

  signInWithFacebook() {
    this.authService.facebookSignIn();
    this.router.navigate(['']);
  }
}
