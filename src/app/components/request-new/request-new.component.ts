import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'wi-request-new',
  templateUrl: './request-new.component.html',
  styleUrls: ['./request-new.component.scss']
})
export class RequestNewComponent implements OnInit {

  @Output('onComplete') completed = new EventEmitter<boolean>();
  processing: boolean = false;

  requestNew: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private snackbar: MatSnackBar) {
    this.requestNew = this.formBuilder.group({
      email: ["", Validators.required]
    });

  }

  ngOnInit() {
  }

  submit() {
    this.processing = true;
    let email = this.requestNew.value.email;
    email = email.search("@wampinfotech.com") == -1 ? email + "@wampinfotech.com" : email;
    this.authService.addRequest(email).then(() => {
      this.processing = false;
      this.snackbar.open("Request Sent Successfully", 'CLOSE', { duration: 5000 });
      this.completed.emit(false);
    }, error => {
      this.snackbar.open(error.message, 'CLOSE', { duration: 5000 });
    });
  }

}
