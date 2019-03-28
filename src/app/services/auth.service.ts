import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { User } from 'firebase';
import { DatabaseReference } from '@angular/fire/database/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  request: DatabaseReference;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    let firebaseUser = afAuth.auth.currentUser;
    if (firebaseUser != null) {
      this.user = firebaseUser;
      localStorage.setItem("isLogin", "1");
    }
    this.request = this.db.database.ref("requests");
  }

  isAuthenticated() {
    return localStorage.getItem("isLogin") == "1";
  }

  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  getUser() {
    return this.db.object('users/' + JSON.parse(localStorage.getItem("user")).uid).valueChanges();
  }

  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  addRequest(email: string) {
    return this.request.push({ email, time: Date.now(), read: false });
  }
}