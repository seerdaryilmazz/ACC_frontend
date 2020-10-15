import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'ngx-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
})
export class DateRangePickerComponent implements OnInit {
  @Output() onChange = new EventEmitter<any>();
  @Input() firstDate: Date;
  @Input() firstLabel: string;
  @Input() secondDate: Date;
  @Input() secondLabel: string;

  constructor() {
  }

  ngOnInit() {
  }

  onFirstDateChange(e) {
    this.firstDate = e;
    this.onValueChange();
  }

  onSecondDateChange(e) {
    this.secondDate = e;
    this.onValueChange();
  }

  onValueChange() {
    this.onChange.emit({ 'firstDate': this.firstDate, 'secondDate': this.secondDate });
  }
}
