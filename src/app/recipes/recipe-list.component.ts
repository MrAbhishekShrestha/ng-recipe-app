import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeItemComponent } from './recipe-item.component';
import { Recipe } from '../shared/recipe.model';
import { RecipeService } from '../shared/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RecipeItemComponent],
  template: `
    <div class="row">
      <div class="col-xs-12">
        <button (click)="onClickNewRecipe()" class="btn btn-success">New Recipe</button>
      </div>
    </div>
    <hr>
    <div class="row">
      <div class="col-xs-12">
        <app-recipe-item 
          *ngFor="let recipeEl of recipes; let i = index;" 
          [recipe]="recipeEl"
          [index]="i"
          ></app-recipe-item>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = []
  destroy = new Subject<boolean>();

  constructor(private recipeService: RecipeService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();
    this.recipeService.recipesChanged.pipe(takeUntil(this.destroy))
      .subscribe(recipes => { this.recipes = recipes; })
  }

  onClickNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }
}
