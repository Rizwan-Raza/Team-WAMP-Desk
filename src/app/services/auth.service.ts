import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { DatabaseReference } from '@angular/fire/compat/database/interfaces';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  request: DatabaseReference;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    let firebaseUser = afAuth.currentUser;
    if (firebaseUser != null) {
      firebaseUser.then(user => {
        this.user = user;
      });
      localStorage.setItem("isLogin", "1");
    }
    this.request = this.db.database.ref("requests");
  }

  isAuthenticated() {
    return localStorage.getItem("isLogin") == "1";
  }

  login(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  getUser() {
    return this.db.object('users/' + JSON.parse(localStorage.getItem("user")).uid).valueChanges();
  }

  resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  addRequest(email: string) {
    return this.request.push({ email, time: Date.now(), read: false });
  }
}