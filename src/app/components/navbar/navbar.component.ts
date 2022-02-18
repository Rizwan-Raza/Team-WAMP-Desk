import { Component, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AttendanceService } from '../../services/attendance.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Input("title") title: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private _router: Router, private attend: AttendanceService, private snackbar: MatSnackBar) { }

  logout() {
    this._router.navigate(['/login']);
    this.attend.logoutEntry(data => {
      // console.log(data);
      this.attend.makeStatus("offline", JSON.parse(localStorage.getItem("user")).uid);
      let sbRef = this.snackbar.open("You can close your system now", "CLOSE", { duration: 4000 });
      sbRef.onAction().subscribe(() => {
        sbRef.dismiss();
      });
      localStorage.setItem("isLogin", "0");
    }, error => {
      let sbRef = this.snackbar.open("Sorry, Logout Again", "CLOSE", { duration: 4000 });
      sbRef.onAction().subscribe(() => {
        sbRef.dismiss();
      });
      this._router.navigate(['/home']);
      console.log(error.message);
    });
  }

}
