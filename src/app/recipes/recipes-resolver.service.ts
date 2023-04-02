import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "../shared/recipe.model";
import { RecipeService } from "../shared/recipe.service";

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  dataStorageService = inject(DataStorageService);
  recipeService = inject(RecipeService)

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    const existingRecipes = this.recipeService.getRecipes();
    return (existingRecipes.length === 0)
      ? this.dataStorageService.fetchRecipes()
      : existingRecipes;
  }
}