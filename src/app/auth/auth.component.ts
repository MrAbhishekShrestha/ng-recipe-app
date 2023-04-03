import { NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { LoadingSpinnerComponent } from "../shared/loading-spinner.component";
import { AuthForm, AuthResponse, AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { AlertComponent } from "../shared/alert.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, LoadingSpinnerComponent, NgIf, AlertComponent],
  template: `
    <div class="row">
      <div class="col-xs-12 col-md-6 col-md-offset-3">
        <!-- <div class="alert alert-danger" *ngIf="error">
          <p>{{ error }}</p>
        </div> -->
        <app-alert [message]="error" (close)="onAlertClosed()" *ngIf="error"></app-alert>
        <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)" *ngIf="!isLoading; else loading">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" name="email" id="email" class="form-control"
              ngModel required email>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" class="form-control"
              ngModel required minlength="6">
          </div>
          <div>
            <button class="btn btn-primary"
              [disabled]="!authForm.valid">{{ isLoginMode ? 'Login' : 'Sign Up' }}</button> 
            | 
            <button class="btn btn-primary" type="button" (click)="onSwitchMode()">
              Switch To {{ isLoginMode ? 'Sign Up' : 'Login' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <ng-template #loading>
      <app-loading-spinner></app-loading-spinner>
    </ng-template>
  `,
  styles: [``]
})
export class AuthComponent {
  isLoginMode = true;
  authService = inject(AuthService);
  router = inject(Router);
  isLoading = false;
  error: string = null;
  auth$ = new Observable<AuthResponse>;

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    this.error = null;
    this.isLoading = true;
    this.auth$ = this.isLoginMode
      ? this.authService.signin(authForm.value as AuthForm)
      : this.authService.signup(authForm.value as AuthForm);

    this.auth$.subscribe({
      next: (resp) => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err;
        console.error(err);
      },
    });
  }

  onAlertClosed() {
    this.error = null;
  }

}