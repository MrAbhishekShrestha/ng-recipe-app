import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecipeService } from '../shared/recipe.service';
import { Recipe } from '../shared/recipe.model';

@Component({
  selector: 'app-recipe-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSave()">
      <div class="row">
        <div class="col-xs-12">
          <button type="submit" class="btn btn-success" [disabled]="!form.valid">Save</button>
          <button type="button" class="btn btn-danger" (click)="onCancel()">Cancel</button>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-xs-12">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" class="form-control" formControlName="name" #name>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <div class="form-group">
            <label for="imagePath">Image URL</label>
            <input type="text" name="imagePath" id="imagePath" class="form-control" formControlName="imagePath" #imagePath>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <img [src]="imagePath.value" class="img-responsive">
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <div class="form-group">
            <label for="description">Description</label>
            <textarea type="text" name="description" id="description" 
              class="form-control" rows="6" formControlName="description"></textarea>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12" formArrayName="ingredients">
          <label>Ingredients</label>
          <div class="row ing-row" *ngFor="let ingredientCtrl of ingredientsControls; let i = index" [formGroupName]="i">
            <div class="col-xs-6">
              <input type="text" class="form-control" formControlName="name">
            </div>
            <div class="col-xs-4">
              <input type="number" class="form-control" formControlName="amount">
            </div>
            <div class="col-xs-1">
              <button class="btn btn-danger" type="button" (click)="onRemoveIngredient(i)">X</button>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-xs-12">
              <button class="btn btn-success" type="button" (click)="onAddIngredient()">Add Ingredient</button>
            </div>
          </div>
        </div>
      </div>
    </form>

    <!-- Styles -->
    <style>
      button {
        margin-left: 2px;
        margin-right: 2px;
      }

      .ing-row {
        margin-top: 10px;
      }

      input.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched {
        border: 1px solid red;
      }
    </style>
  `,
  styles: [
  ]
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  destroy = new Subject<boolean>();
  form: FormGroup;
  currentRecipe: Recipe;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy)).subscribe(params => {
      if (params['id']) {
        this.editMode = true;
        this.id = +params['id'];
        this.currentRecipe = this.recipeService.getRecipeById(this.id);
      } else {
        this.editMode = false;
        this.id = undefined;
      }
      this.initForm();
    });

  }

  initForm(): void {
    let recipeIngredients = new FormArray([])
    this.form = new FormGroup({
      name: new FormControl(this.currentRecipe?.name, Validators.required),
      imagePath: new FormControl(this.currentRecipe?.imagePath, Validators.required),
      description: new FormControl(this.currentRecipe?.description, Validators.required),
      ingredients: recipeIngredients
    });

    if (this.currentRecipe?.ingredients) {
      for (let ingred of this.currentRecipe.ingredients) {
        recipeIngredients.push(new FormGroup({
          "name": new FormControl(ingred.name, Validators.required),
          "amount": new FormControl(ingred.amount, [Validators.required, , Validators.pattern(/^[1-9]+[0-9]*$/)])
        }));
      }
    }
  }

  onSave() {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.form.value)
    } else {
      this.recipeService.addRecipe(this.form.value);
    }
    this.onCancel();
  }

  get ingredientsControls() {
    return (<FormArray>this.form.get("ingredients")).controls
  }

  onAddIngredient() {
    (<FormArray>this.form.get("ingredients")).push(new FormGroup({
      "name": new FormControl(null, Validators.required),
      "amount": new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }

  onRemoveIngredient(index: number) {
    (<FormArray>this.form.get("ingredients")).removeAt(index);
  }


  printForm() {
    console.log(this.form);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }
}
