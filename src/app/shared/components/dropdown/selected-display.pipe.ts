import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../../translate/translate.service';

@Pipe({
    name: 'selectedDisplay',
})
export class SelectedDisplay implements PipeTransform {
    constructor(private translateService: TranslateService) { }

    public transform(selectedDisplayText: string, args: any[]): any {
        const array = selectedDisplayText.split('+');
        if (array.length > 1) {
            array[0] =  this.translateService.instant(array[0].trim());
            return array.join(' +');
        } else {
            return this.translateService.instant(array.join('').trim());
        }
    }
}
