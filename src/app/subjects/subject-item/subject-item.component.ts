import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup, Validators, FormGroupDirective, NgForm
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { SubjectElement, SubjectService } from '../../services/subject.service';
import { SubjectTableComponent } from '../subject-table/subject-table.component';

@Component({
  selector: 'subject-item',
  templateUrl: './subject-item.component.html',
  styleUrls: ['./subject-item.component.css'],
})
export class SubjectItemComponent implements OnInit {
  subjectForm: FormGroup = this.formBuilder.group({
    position: [,  { updateOn: 'change' }],
    dateSubject: [, { updateOn: 'change' }],
    topic: [, { updateOn: 'change' }],
    homework: [, { updateOn: 'change' }],
    notice: [, { updateOn: 'change' }],
  });

  @Input() parent: SubjectTableComponent;

  @ViewChild('formDirective') private formDirective: NgForm;

  elementExist = false;
  buttonText = '';

  constructor(
    private dateAdapter: DateAdapter<any>,
    private subjectSrv: SubjectService,
    private formBuilder: FormBuilder
  ) {
    this.dateAdapter.setLocale('ru');
    this.updateButtonText();
    console.log(this.subjectForm);
  }

  addElement(): void {
    if (!this.subjectForm.valid) {
      console.log(this.subjectForm);
      return;
    }
    const element: SubjectElement = {
      position: this.subjectForm.get('position').value,
      dateSubject: this.subjectForm.get('dateSubject').value,
      topic: this.subjectForm.get('topic').value,
      homework: this.subjectForm.get('homework').value,
      notice: this.subjectForm.get('notice').value,
    };
    this.subjectSrv.addElement(element);
    this.parent.reloadSubjects();
    this.elementExist = false;
    this.updateButtonText();

    this.subjectForm.reset();
    this.formDirective.resetForm();
  }

  checkExist(): void {
    this.elementExist = false;
    this.subjectSrv.subjects.forEach((item) => {
      if (item.position === this.subjectForm.get('position').value) {
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
    // tslint:disable-next-line: forin
    for (const key in this.subjectForm.controls) {
      this.subjectForm.get(key).setValue(element[key]);
    }
    this.elementExist = true;
    this.updateButtonText();
  }

  clean(): void {
    this.subjectForm.reset();
    this.formDirective.resetForm();

    this.elementExist = false;
    this.updateButtonText();
  }


  ngOnInit(): void {}
}
