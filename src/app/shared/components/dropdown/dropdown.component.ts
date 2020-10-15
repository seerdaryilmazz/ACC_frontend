import { Component, OnInit, ChangeDetectorRef, ElementRef, forwardRef } from '@angular/core';
import { SelectDropDownComponent } from 'ngx-select-dropdown';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { TranslateService } from '../../translate/translate.service';

@Component({
  selector: 'select-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent extends SelectDropDownComponent {

  constructor(private cdRef: ChangeDetectorRef, private el: ElementRef, private translateService: TranslateService) {
    super(cdRef, el);
  }

  public resetValues() {
    this.selectedItems.forEach(i => {
      this.deselectItem(i, 0);
    });
    super.reset();
  }
}
