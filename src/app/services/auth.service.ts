import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { User } from '../entity/user';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  authenticated = false;
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private aFireStore: AngularFirestore
  ) {
    this.user$ = this.angularFireAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.authenticated = true;
          return this.aFireStore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoginSubject.next(false);
    this.authenticated = false;
    this.angularFireAuth.auth.signOut();
  }

  googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    localStorage.setItem('token', 'JWT');
    this.isLoginSubject.next(true);
    return this.oAuthLogin(provider);
  }

  twitterSignIn() {
    const provider = new firebase.auth.TwitterAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    localStorage.setItem('token', 'JWT');
    this.isLoginSubject.next(true);
    return this.oAuthLogin(provider);
  }

  facebookSignIn() {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    localStorage.setItem('token', 'JWT');
    this.isLoginSubject.next(true);
    return this.oAuthLogin(provider);
  }

  githubSignIn() {
    const provider = new firebase.auth.GithubAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    localStorage.setItem('token', 'JWT');
    this.isLoginSubject.next(true);
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.angularFireAuth.auth.signInWithPopup(provider).then(result => {
      this.updateUserInfo(result.user);
      this.authenticated = true;
    });
  }
  updateUserInfo(user) {
    const userReference: AngularFirestoreDocument<any> = this.aFireStore.doc(
      `users/${user.uid}`
    );
    userReference.valueChanges().subscribe(userInfo => {
      if (!userInfo) {
        console.log('User Info is not available');
        const data: User = {
          name: user.displayName,
          role: {
            subscriber: true
          },
          userId: user.uid,
          image: user.photoURL,
          bookcount: 20
        };
        return userReference.set(data, { merge: true });
      } else {
        console.log('User Info is available');
        return userInfo;
      }
    });
  }

  canRead(user: User): boolean {
    const allowed = ['admin', 'subscriber'];
    return this.checkAuth(user, allowed);
  }

  private checkAuth(user: User, allowedRoles: string[]): boolean {
    if (!user) {
      return false;
    }
    for (const roleText of allowedRoles) {
      if (user.role[roleText]) {
        return true;
      }
    }
    return false;
  }
}
