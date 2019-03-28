import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AttendanceService } from '../../services/attendance.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'wi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('email') email: ElementRef;
  user;

  constructor(private attendance: AttendanceService, private snackbar: MatSnackBar, private auth: AuthService) {
    this.user = JSON.parse(localStorage.getItem("user"));
  }

  ngOnInit() {
    this.attendance.addEntry().then(data => {
      this.snackbar.open(data, "CLOSE", { duration: 4000 });
    });
  }

  ngAfterViewInit() {
    this.email.nativeElement.innerHTML = this.user.email;
    this.auth.getUser().subscribe(e => {
      this.user = e;
    });
  }

}
