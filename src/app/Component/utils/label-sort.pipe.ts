import { Pipe, PipeTransform } from '@angular/core';
import {Note} from '../../model/Note';
import {Label} from '../../model/Label';

@Pipe({
  name: 'labelSort'
})
export class LabelSortPipe implements PipeTransform {
  transform(labels: Label[], searchTerm: string): Label[] {
    if (!labels || !searchTerm) {
      return labels;
    }
    return  labels.filter(label =>
      label.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    );
  }

}
