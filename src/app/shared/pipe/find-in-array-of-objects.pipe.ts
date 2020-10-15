import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Pipe({
  name: 'findInArrayOfObjects',
})
export class FindInArrayOfObjectsPipe implements PipeTransform {

  constructor(private utils: UtilsService) {}

  transform(value: any[], searchField: any, fieldValue: any, returnField?: any): any {

    const obj = value.find(i => this.utils.getNestedData(i, searchField) === fieldValue);
    if (obj != null) {
      return this.utils.getNestedData(obj, (returnField ? returnField : fieldValue));
    }
    return null;
  }
}
