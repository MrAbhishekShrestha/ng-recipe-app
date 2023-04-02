import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeListComponent } from './recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, RecipeListComponent, RecipeDetailComponent, RouterOutlet],
  template: `
    <div class="row">
      <div class="col-md-7">
        <app-recipe-list></app-recipe-list>
      </div>
      <div class="col-md-5">
        <router-outlet></router-outlet>
    </div>
  `,
  styles: [
  ]
})
export class RecipesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

}
