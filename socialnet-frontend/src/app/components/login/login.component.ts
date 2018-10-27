import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;
  showSpinner = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loginUser() {
    this.showSpinner = true;
    this.authService.loginUser(this.loginForm.value).subscribe(
      data => {
        this.tokenService.setToken(data.token);
        this.loginForm.reset();
        setTimeout(() => {
          this.router.navigate(['streams']);
        }, 2000);
      },
      error1 => {
        this.showSpinner = false;

        if (error1.error.message) {
          this.errorMessage = error1.error.message;
        }
      }
    );
  }
}
