import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../shared/recipe.model';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-recipe-item',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, RouterLinkActive],
  template: `
    <a [routerLink]="[index]" routerLinkActive="active"
      style="cursor: pointer;" class="list-group-item clearfix">
      <div class="pull-left">
        <h4 class="list-group-item-heading">{{ recipe.name }}</h4>
        <p class="list-group-item-text">{{ recipe.description }}</p>
      </div>
      <div class="pull-right">
        <img [src]="recipe.imagePath" alt="{{ recipe.name }}" class="img-responsive" style="max-height: 50px">
      </div>
    </a>
  `,
  styles: [
  ]
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() index: number;

  constructor() { }

  ngOnInit(): void {
  }

}
