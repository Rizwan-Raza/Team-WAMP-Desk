import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatabaseReference } from '@angular/fire/database/interfaces';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  entries: DatabaseReference;

  constructor(private db: AngularFireDatabase) {
    this.entries = this.db.database.ref("entries");
  }

  async addEntry() {
    let uid = JSON.parse(localStorage.getItem("user")).uid;
    let retVal;
    await this.entries.orderByChild("uid").equalTo(uid).limitToLast(1).once('value', snapshot => {
      if (snapshot.numChildren() > 0) {

        snapshot.forEach(e => {
          if (new Date(e.val().time).getDate() == new Date().getDate()) {
            retVal = "Welcome Back!";
          } else {
            this.pushEntry(uid).then(data => { retVal = data; });
          }
        })
      } else {
        this.pushEntry(uid).then(data => { retVal = data; });
      }
    });

    return retVal;
  }
  async pushEntry(uid) {
    let retVal;
    await this.entries.push({ uid, time: Date.now() }).then(() => {
      retVal = "Today's Entry Added";
    }, error => {
      retVal = error.message
    });
    return retVal;
  }
}

