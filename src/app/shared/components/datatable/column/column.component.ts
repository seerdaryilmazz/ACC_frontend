import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'ngx-datatable-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit {
  // Translate olacak değer
  @Input() title: string;

  // Obje içindeki ulaşılmak istenen path (nested için nokta kullan => country.name)
  @Input() value: string;

  // Arrow function olarak yazılması global/local scope "this" binding problemini ortadan kaldırır
  // (functionName = (param) => { return doSomething(param)})
  @Input() customValueFunction: (cell, row, column) => any;
  @Input() searchFunction: (cell, row, column) => any;
  @Input() sortFunction: (direction, a, b) => any;
  @Input() width: string = '';
  @Input() rendererComponent: Component;
  @Input() search: boolean = false;
  @Input() type: string;
  @Input() translate: boolean;
  @Input() dateFormat: string;

  constructor() { }

  ngOnInit() {
  }
}
