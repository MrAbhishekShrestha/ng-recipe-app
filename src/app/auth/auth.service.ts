import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";
import { Router } from "@angular/router";

export type AuthForm = {
  email: string,
  password: string
}

export interface AuthResponse {
  kind: string;
  idToken: string;
  displayName?: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  BASE_URL = "https://identitytoolkit.googleapis.com/v1/accounts";
  API_KEY = "AIzaSyDh048QH9n4O-ZFbcFXbqFPm4pc327_zvg";

  private http = inject(HttpClient);
  private router = inject(Router)
  user = new BehaviorSubject<User>(null);
  public user$ = this.user.asObservable();
  private tokenExpirationTimer: any;

  signup(signUpForm: AuthForm) {
    const body = { ...signUpForm, returnSecureToken: true };
    return this.http.post<AuthResponse>(`${this.BASE_URL}:signUp?key=${this.API_KEY}`, body)
      .pipe(
        tap(resp => this.updateAuthStateWithUser(resp)),
        catchError(this.handleError)
      );
  }

  signin(signInForm: AuthForm) {
    const body = { ...signInForm, returnSecureToken: true };
    return this.http.post<AuthResponse>(`${this.BASE_URL}:signInWithPassword?key=${this.API_KEY}`, body)
      .pipe(
        tap(resp => this.updateAuthStateWithUser(resp)),
        catchError(this.handleError)
      );
  }

  private handleError(errResp: HttpErrorResponse) {
    const errorMessage = errResp?.error?.error?.message;
    return throwError(() => errorMessage);
  }

  private updateAuthStateWithUser(resp: AuthResponse) {
    const expirationDate = new Date(Number(resp.expiresIn) * 1000 +
      new Date().getTime());
    const newUser = new User(resp.displayName, resp.email, resp.localId,
      resp.idToken, expirationDate);
    this.user.next(newUser);
    localStorage.setItem('authUser', JSON.stringify(newUser));
    this.autoLogout(Number(resp.expiresIn) * 1000);
  }

  autoLogin() {
    const userData: {
      displayName: string,
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: Date
    } = JSON.parse(localStorage.getItem('authUser'));

    if (!userData) return;
    const loadedUser = new User(userData.displayName, userData.email,
      userData.id, userData._token, userData._tokenExpirationDate);
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime()
        - new Date().getTime()
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    const expirationTimer = setTimeout(() => {
      this.signout();
    }, expirationDuration);
  }

  signout() {
    this.user.next(null);
    localStorage.removeItem('authUser');
    this.router.navigate(['/auth']);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }
}