import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from './ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient("Apple", 5),
    new Ingredient("Banana", 2)
  ];
  ingredientsChanged = new Subject<Ingredient[]>();
  editIngredient = new Subject<number>();

  constructor() { }

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ing: Ingredient) {
    this.ingredients.push(ing);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingArr: Ingredient[]) {
    this.ingredients.push(...ingArr);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index: number, updated: Ingredient) {
    this.ingredients[index] = { ...updated } as Ingredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

}
