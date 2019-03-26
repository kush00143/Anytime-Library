import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, isFilterText: boolean): any[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();
    return items.filter(itData => {
      if (isFilterText === true) {
        return itData.title.toLowerCase().includes(searchText);
      } else {
        return itData.author.toLowerCase().includes(searchText);
      }
    });
  }
}
