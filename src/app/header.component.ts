import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgForOf, NgIf } from '@angular/common';
import { DropdownDirective } from './shared/dropdown.directive';
import { Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { DataStorageService } from './shared/data-storage.service';
import { AuthService } from './auth/auth.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { User } from './auth/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DropdownDirective, RouterLinkWithHref, RouterLinkActive, NgIf, AsyncPipe, NgForOf],
  template: `
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" (click)="collapsed = !collapsed">
            <span class="icon-bar" *ngFor="let iconBar of [1, 2, 3]"></span>
          </button>
          <a [routerLink]="['/recipes']" class="navbar-brand">Recipe Book</a>
        </div>
        <div class="navbar-collapse" [class.collapse]="collapsed" (window:resize)="collapsed=true">
          <ul class="nav navbar-nav">
            <li routerLinkActive="active"><a [routerLink]="['/recipes']" *ngIf="authenticated">Recipes</a></li>
            <li routerLinkActive="active"><a [routerLink]="['/auth']" *ngIf="!authenticated">Authenticate</a></li>
            <li routerLinkActive="active"><a [routerLink]="['/shopping-list']">Shopping List</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right" *ngIf="(user$ | async) as user">
            <li><a (click)="signout()">Logout</a></li>
            <li class="dropdown" appDropdown>
              <a class="dropdown-toggle" role="button">Manage
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                <li><a (click)="saveData()">Save Data</a></li>
                <li><a (click)="fetchData()">Fetch Data</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    a {
      cursor: pointer;
    }
  `]
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  authenticated = false;
  user$: Observable<User>;

  dataStorageService = inject(DataStorageService);
  authService = inject(AuthService);
  router = inject(Router)

  ngOnInit(): void {
    this.user$ = this.authService.user$.pipe(
      tap(user => { this.authenticated = user ? true : false; })
    );
  }

  saveData() {
    this.dataStorageService.saveRecipes().subscribe();
  }

  fetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  signout() {
    this.authService.signout();
  }
}
