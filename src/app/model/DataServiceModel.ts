import {Note} from './Note';
import {Label} from './Label';

export interface DataServiceModel {
  note ?: Note;
  label ?: Label;
  color ?: string;
  indexOfNote ?: number;
  indexOfLabel ?: number;
  indexOfColor ?: number;

}
