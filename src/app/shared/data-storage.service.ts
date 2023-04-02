import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  http = inject(HttpClient);
  recipesService = inject(RecipeService);
  authService = inject(AuthService);
  BASE_URL = "https://ng-course-recipe-book-89937-default-rtdb.asia-southeast1.firebasedatabase.app"

  saveRecipes() {
    const recipes = this.recipesService.getRecipes();
    return this.http.put<Recipe[]>(`${this.BASE_URL}/recipes.json`,
      recipes).pipe(tap(resp => console.log(resp)));
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(`${this.BASE_URL}/recipes.json`).pipe(
      map(recipes => recipes.map(recipe => {
        return { ...recipe, ingredients: recipe.ingredients ?? [] };
      })),
      tap(resp => this.recipesService.setRecipes(resp))
    )
  }
}