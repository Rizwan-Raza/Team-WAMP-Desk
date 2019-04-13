import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AttendanceService } from '../../services/attendance.service';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';

@Component({
  selector: 'wi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title: string = "Home";
  status: boolean = false;
  error: boolean = false;
  @ViewChild('email') email: ElementRef;
  @ViewChild('status') statusEl: ElementRef;
  user;
  greet = "";

  constructor(private attendance: AttendanceService, private snackbar: MatSnackBar, private auth: AuthService, private changeDetect: ChangeDetectorRef) {
    this.user = JSON.parse(localStorage.getItem("user"));
  }


  ngOnInit() {
    this.greet = this.user.email.replace("@wampinfotech.com", "");
    this.greet = this.greet[0].toUpperCase() + this.greet.substring(1)
    this.attendance.addEntry(data => {
      this.status = true;
      console.log(data);
      this.changeDetect.detectChanges();
      let sbRef = this.snackbar.open(data, "CLOSE");
      sbRef.onAction().subscribe(() => {
        sbRef.dismiss();
        this.changeDetect.detectChanges();
        setTimeout(() => {
          this.changeDetect.detectChanges();
        }, 500);
      });

    }, error => {
      this.status = true;
      this.error = true;
      let sbRef = this.snackbar.open(error.message, "CLOSE", { duration: 4000 });
      sbRef.onAction().subscribe(() => {
        sbRef.dismiss();
        this.changeDetect.detectChanges();
        setTimeout(() => {
          this.changeDetect.detectChanges();
        }, 500);
      });

    });
    this.attendance.makeStatus("online", JSON.parse(localStorage.getItem("user")).uid);

  }

  ngAfterViewInit() {
    this.email.nativeElement.innerHTML = this.user.email;
    this.auth.getUser().subscribe(e => {
      this.user = e;
    });
  }

}
