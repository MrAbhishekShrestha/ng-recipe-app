import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <div class="col-xs-6">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = "ng-recipe-app";

  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.autoLogin();
  }

}
