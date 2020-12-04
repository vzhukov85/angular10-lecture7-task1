import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { SubjectTableComponent } from '../subject-table/subject-table.component';
import { SubjectElement, SubjectService } from '../../services/subject.service';

@Component({
  selector: 'subject-item',
  templateUrl: './subject-item.component.html',
  styleUrls: ['./subject-item.component.css'],
})
export class SubjectItemComponent implements OnInit {
  @Input() position;
  @Input() dateSubject;
  @Input() topic;
  @Input() homework;
  @Input() notice;

  @Input() parent: SubjectTableComponent;

  elementExist = false;
  buttonText = '';

  constructor(
    private dateAdapter: DateAdapter<any>,
    private subjectSrv: SubjectService
  ) {
    this.dateAdapter.setLocale('ru');
    this.updateButtonText();
  }

  addElement(): void {
    const element: SubjectElement = {
      position: this.position,
      dateSubject: this.dateSubject,
      topic: this.topic,
      homework: this.homework,
      notice: this.notice,
    };
    console.log('add element', element);
    this.subjectSrv.addElement(element);
    this.parent.reloadSubjects();
    this.elementExist = true;
    this.updateButtonText();
  }

  checkExist(): void {
    this.elementExist = false;
    this.subjectSrv.subjects.forEach(item => {
      if (item.position === this.position) {
        this.elementExist = true;
        return;
      }
    });
    this.updateButtonText();
  }

  private updateButtonText(): void {
    if (this.elementExist) {
      this.buttonText = 'Изменить';
    } else {
      this.buttonText = 'Добавить';
    }
  }

  selectElement(element: SubjectElement): void {
    this.position = element.position;
    this.dateSubject = element.dateSubject;
    this.topic = element.topic;
    this.homework = element.homework;
    this.notice = element.notice;
    this.elementExist = true;
    this.updateButtonText();
  }

  clean(): void {
    this.position = null;
    this.dateSubject = null;
    this.topic = null;
    this.homework = null;
    this.notice = null;
    this.elementExist = false;
    this.updateButtonText();
  }

  ngOnInit(): void {}
}
