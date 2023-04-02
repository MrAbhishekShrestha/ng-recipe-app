import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-please-select-recipe',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>
      Please select a recipe!
    </h3>
  `,
  styles: [
  ]
})
export class PleaseSelectRecipeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
