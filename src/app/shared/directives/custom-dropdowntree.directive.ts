import { Directive, Host, Self, Optional, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { DropdownTreeviewComponent } from 'ngx-treeview';

@Directive({
  selector: '[customDropdowntree]',
})
export class CustomDropdowntreeDirective implements OnInit {
  @Input('placeHolder') placeHolder: string;
  @Input('displayValue') displayValue: string;

  constructor(private el: ElementRef,
    private renderer: Renderer2,
    @Host() @Self() @Optional() public ddTreeComp: DropdownTreeviewComponent) {

  }

  ngOnInit() {
    if (this.ddTreeComp && this.placeHolder) {
      this.setPlaceHolder(this.placeHolder);
    }
  }

  setPlaceHolder(placeHolder) {
    // Overrides DropdownTreeviewComponent getText() method
    this.ddTreeComp.getText = () => {
      const selection = this.ddTreeComp.treeviewComponent.selection;
      const allItems = [...selection.checkedItems, ...selection.uncheckedItems];
      const allDistinctItems = [...new Set(allItems.map(i => i.value[this.displayValue]))];
      const selectedDistinctItems = [...new Set(selection.checkedItems.map(i => i.value[this.displayValue]))];
      const numberOfSelectionString = ' (' + selectedDistinctItems.length + ') ';
      if (selection.checkedItems.length >= allDistinctItems.length) {
        return 'All' + numberOfSelectionString;
      }
      switch (selectedDistinctItems.length) {
        case 0:
          return placeHolder;
        case 1:
          return selectedDistinctItems[0];
        default:
          const selectedDistinctItemsString = selectedDistinctItems.join(', ');
          const text = selectedDistinctItemsString.length > 30
          ? numberOfSelectionString + selectedDistinctItemsString.substring(0, 31) + '...'
          : numberOfSelectionString + selectedDistinctItemsString;
          return text;
      }
    };
  }
}
