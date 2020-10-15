import { Pipe, PipeTransform } from '@angular/core';

/**
 * filters an array based on searctext
 */
@Pipe({
    name: 'filterby',
})
export class FilterByPipe implements PipeTransform {
    public transform(array: any[], searchText?: string, keyName?: string) {
        if (!array || !searchText || !Array.isArray(array)) {
            return array;
        }
        if (typeof array[0] === 'string') {
            return array.filter((item) => this.unaccent(item).indexOf(this.unaccent(searchText)) > -1);
        }
        // filter array, items which match and return true will be
        // kept, false will be filtered out
        if (!keyName) {
            return array.filter((item: any) => {
                for (const key in item) {
                    if (typeof item[key] !== "object" && this.unaccent(item[key].toString()).indexOf(this.unaccent(searchText)) > -1) {
                        return true;
                    }
                }
                return false;
            });
        } else {
            return array.filter((item: any) => {
                if (typeof item[keyName] !== "object" && this.unaccent(item[keyName].toString()).indexOf(this.unaccent(searchText)) > -1) {
                    return true;
                }
                return false;
            });
        }

    }

    unaccent(string) {
        return string.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
}