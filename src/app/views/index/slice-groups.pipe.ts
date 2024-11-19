import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceGroups',
  standalone: true, // Agrega esto para que el pipe sea standalone
})
export class SliceGroupsPipe implements PipeTransform {
  transform(arr: any[], size: number): any[][] {
    const newArr = [];
    for (let i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  }
}
