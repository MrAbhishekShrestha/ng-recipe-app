import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shared/shopping-list.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="row">
      <div class="col-xs-12">
        <form (ngSubmit)="onAdd()" #f="ngForm">
          <div class="row">
            <div class="col-sm-5 form-group">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" class="form-control" required ngModel>
            </div>
            <div class="col-sm-3 form-group">
              <label for="amount">Amount</label>
              <input type="number" name="amount" id="amount" class="form-control" required ngModel pattern="^[1-9]+[0-9]*$">
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <button class="btn btn-success" type="submit" [disabled]="!f.valid">
                {{ editMode ? 'Edit' : 'Add'}}
              </button>
              <button class="btn btn-danger" type="button" *ngIf="editMode" (click)="onDelete()">Delete</button>
              <button class="btn btn-primary" type="button" (click)="onReset()">Clear</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Styles -->
    <style>
      button {
        margin-left: 2px;
        margin-right: 2px;
      }
    </style>
  `,
  styles: [
  ]
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: true }) editForm: NgForm;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  destroy = new Subject<boolean>();

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.shoppingListService.editIngredient.pipe(takeUntil(this.destroy)).subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.editForm.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    )
  }

  onAdd() {
    const name = this.editForm.value.name;
    const amount = this.editForm.value.amount;
    if (!this.editMode) {
      this.shoppingListService.addIngredient(new Ingredient(name, amount));
    } else {
      this.shoppingListService.updateIngredient(this.editedItemIndex, new Ingredient(name, amount));
    }
  }

  onReset() {
    this.editForm.resetForm();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.editedItem = null;
    this.onReset();
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }

}
