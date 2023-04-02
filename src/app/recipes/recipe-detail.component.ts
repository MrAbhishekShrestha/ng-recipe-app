import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../shared/recipe.model';
import { DropdownDirective } from '../shared/dropdown.directive';
import { RecipeService } from '../shared/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, DropdownDirective],
  template: `
    <div class="row">
      <div class="col-xs-12">
        <img [src]="recipe.imagePath" [alt]="recipe.name" class="img-responsive"
          style="max-height: 350px">
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <h1>{{ recipe.name }}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <div class="btn-group" appDropdown>
          <button type="button" class="btn btn-primary dropdown-toggle">
            Manage Recipe
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu">
            <li><a (click)="onClickToShoppingList()">To Shopping List</a></li>
            <li><a (click)="onClickToEditRecipe()">Edit Recipe</a></li>
            <li><a (click)="onClickToDeleteRecipe()">Delete Recipe</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">{{ recipe.description }}</div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <ul class="list-group">
          <li class="list-group-item"
            *ngFor="let ing of recipe.ingredients"
          > {{ ing.name }} ({{ ing.amount }})</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    a {
      cursor: pointer;
    }
  `
  ]
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  destroy = new Subject<boolean>();
  id: number;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => +params['id']),
      map(id => {
        this.id = id;
        this.recipe = this.recipeService.getRecipeById(id)
      }),
      takeUntil(this.destroy)
    ).subscribe()
  }

  onClickToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onClickToEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onClickToDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }

}
