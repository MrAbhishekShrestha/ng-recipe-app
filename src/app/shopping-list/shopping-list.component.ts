import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingEditComponent } from './shopping-edit.component';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shared/shopping-list.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule, ShoppingEditComponent],
  template: `
    <div class="row">
      <div class="col-xs-10">
        <app-shopping-edit></app-shopping-edit>
        <hr>
        <ul class="list-group">
          <a 
          class="list-group-item" 
          style="cursor: pointer" 
          *ngFor="let ingredient of ingredients; let i = index"
          (click)="onEditItem(i)"
          >
            {{ingredient.name}} ({{ingredient.amount}})
          </a>
        </ul>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  destroy = new Subject<boolean>();

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.slService.getIngredients();
    this.slService.ingredientsChanged
      .pipe(takeUntil(this.destroy))
      .subscribe(newIngArr => { this.ingredients = newIngArr; })
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }

  onEditItem(index: number) {
    this.slService.editIngredient.next(index);
  }
}
