import { Injectable } from '@angular/core';
import { Grades, JournalGrades, TotalGrades } from './student-grades.service';
import { SubjectElement } from './subject.service';

@Injectable({
  providedIn: 'root'
})
export class JournalDaoService {

  subject_key = 'subjects';
  grades_key = 'grades';

  constructor() {}

  getAllSubjects(): SubjectElement[] {
    let obj: SubjectElement[] = JSON.parse(localStorage.getItem(this.subject_key));
    if (!obj) {
      obj = [];
    }
    obj.forEach(element => {
      element.dateSubject = new Date(element.dateSubject);
    });
    return obj;
  }

  saveSubjects(subjects: SubjectElement[]): void {
    localStorage.setItem(this.subject_key, JSON.stringify(subjects));
  }

  getAllStudentGrades(): Grades[] {
    let obj: Grades[] = JSON.parse(localStorage.getItem(this.grades_key));
    if (!obj) {
      obj = [];
    }
    return obj;
  }

  getAllTotalGrades(): TotalGrades[] {
    const obj: Grades[] = this.getAllStudentGrades();
    const data: TotalGrades[] = [];
    obj.forEach((item) => {
      data.push(item.totalGrades);
    })
    return data;
  }

  getAllJournalGrades(): JournalGrades[] {
    const obj: Grades[] = this.getAllStudentGrades();
    const data: JournalGrades[] = [];
    obj.forEach((item) => {
      data.push(item.journalGrades);
    })
    return data;
  }

  saveStudentsGrades(grades: Grades[]): void {
    localStorage.setItem(this.grades_key, JSON.stringify(grades));
  }
}
