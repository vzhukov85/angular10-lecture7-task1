import { Component, ViewChild } from '@angular/core';
import { SubjectItemComponent } from '../subject-item/subject-item.component';
import { SubjectElement, SubjectService } from '../../services/subject.service';

@Component({
  selector: 'subject-table',
  templateUrl: './subject-table.component.html',
  styleUrls: ['./subject-table.component.css'],
})
export class SubjectTableComponent {
  displayedColumns: string[] = [
    'position',
    'dateSubject',
    'topic',
    'homework',
    'notice',
    'delete',
  ];

  @ViewChild('item') subjectElement: SubjectItemComponent;
  subjects: SubjectElement[];
  instance: SubjectTableComponent;

  constructor(private subjectSrv: SubjectService) {
    this.reloadSubjects();
    this.instance = this;
  }

  deleteItem(element: SubjectElement): void {
    this.subjectSrv.delete(element);
    this.reloadSubjects();
    this.subjectElement.checkExist();
  }

  getRecord(element: SubjectElement): void {
    this.subjectElement.selectElement(element);
  }

  reloadSubjects(): void {
    this.subjects = this.subjectSrv.subjects;
  }
}
