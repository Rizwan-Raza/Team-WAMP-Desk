import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatabaseReference } from '@angular/fire/database/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  entries: DatabaseReference;
  users: DatabaseReference;

  constructor(private db: AngularFireDatabase) {
    this.entries = this.db.database.ref("entries");
    this.users = this.db.database.ref("users");
  }

  addEntry(cb, er) {
    let uid = JSON.parse(localStorage.getItem("user")).uid;
    this.entries.orderByChild("selector").equalTo(uid + '_entry').limitToLast(1).once('value', snapshot => {
      if (snapshot.numChildren() > 0) {

        snapshot.forEach(e => {
          if (new Date(e.val().time).getDate() == new Date().getDate()) {
            cb("Welcome Back!");
          } else {
            this.pushEntry(uid, 'entry').then(() => cb("Today's Attendance Added"), er);
          }
        });
      } else {
        this.pushEntry(uid, 'entry').then(() => cb("Today's Attendance Added"), er);
      }
    });
  }
  pushEntry(uid, type) {
    return this.entries.push({ uid, type, selector: uid + '_' + type, time: Date.now() + (type == "entry" ? -300000 : +300000) });
  }

  updateEntry(key, success, errorCb) {
    let updates = {};
    updates['/' + key + '/time'] = Date.now() + 300000;
    this.entries.update(updates).then(() => {
      success("Today's Attendance Added");
    }, error => {
      errorCb(error.message);
    });
  }

  async getEntries() {
    let retVal;
    await this.entries.orderByChild('uid').equalTo(JSON.parse(localStorage.getItem("user")).uid).once('value').then(snapshots => {
      retVal = snapshots;
    }, error => {
      retVal = error.message;
    });
    return retVal;
  }

  async logoutEntry(success, error) {
    let uid = JSON.parse(localStorage.getItem("user")).uid;
    let retVal;
    await this.entries.orderByChild('selector').equalTo(uid + '_exit').limitToLast(1).once('value', async snapshot => {
      if (snapshot.numChildren() > 0) {

        snapshot.forEach(e => {
          if (new Date(e.val().time).getDate() == new Date().getDate()) {
            this.updateEntry(e.key, success, error);
          } else {
            this.pushEntry(uid, 'exit').then(success, error);
          }
        })
      } else {
        await this.pushEntry(uid, 'exit').then(success, error);
      }
    });

    return retVal;
  }

  makeStatus(status: string, uid: string) {
    let updates = {};
    updates['/' + uid + '/status'] = status;
    this.users.update(updates).then(console.log, error => {
      console.log(error.message);
    });
  }
}