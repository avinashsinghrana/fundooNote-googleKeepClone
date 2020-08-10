import { Pipe, PipeTransform } from '@angular/core';
import {Note} from '../../model/Note';

@Pipe({
  name: 'noteSort'
})
export class NoteSortPipe implements PipeTransform {
  transform(notes: Note[], searchTerm: string): Note[] {
    if (!notes || !searchTerm) {
      return notes;
    }
    return  notes.filter(note =>
      note.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      note.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    );
  }

}
