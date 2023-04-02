import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, Observable } from "rxjs";

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>
      <span>Error {{errorCode$ | async }}</span>: {{ errorMessage$ | async }}
    </h3>
  `,
  styles: [`
    span {
      color: red; 
      font-weight: bold;
    }
  `]
})
export class ErrorPageComponent implements OnInit {
  errorMessage$: Observable<string>;
  errorCode$: Observable<number>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.errorMessage$ = this.route.data.pipe(
      map(data => data['message'] as string));
    this.errorCode$ = this.route.data.pipe(
      map(data => data['errorCode'] as number));
  }
}