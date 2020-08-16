import {Label} from './Label';

export class Note {

  color: string;
  createdDate: string;
  description: string;
  id: string;
  imageUrl: string;
  isArchived: boolean;
  isDeleted: boolean;
  isPined: boolean;
  label: Label[];
  linkUrl: "";
  modifiedDate: string;
  noteCheckLists: [];
  noteLabels: Label[];
  questionAndAnswerNotes: [];
  reminder: any[];
  title: string;
}
