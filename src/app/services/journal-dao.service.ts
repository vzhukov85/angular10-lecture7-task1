import { Injectable } from '@angular/core';
import { StudentsGrades } from './student-grades.service';
import { SubjectElement } from './subject.service';

@Injectable({
  providedIn: 'root'
})
export class JournalDaoService {

  constructor() {}

  getAllSubjects(): SubjectElement[] {
    let obj: SubjectElement[] = JSON.parse(localStorage.getItem('subjects'));
    if (!obj) {
      obj = [];
    }
    obj.forEach(element => {
      element.dateSubject = new Date(element.dateSubject);
    });
    return obj;
  }

  saveSubjects(subjects: SubjectElement[]): void {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }

  getAllStudentGrades(): StudentsGrades[] {
    let obj: StudentsGrades[] = JSON.parse(localStorage.getItem('studentsGrades'));
    if (!obj) {
      obj = [];
    }
    return obj;
  }

  saveStudentsGrades(studentsGrades: StudentsGrades[]): void {
    localStorage.setItem('studentsGrades', JSON.stringify(studentsGrades));
  }

  addSubjectFromGrade(index: number): void {
    const grade = this.getAllStudentGrades();
    grade.forEach((item) => {
      item.lectureGrades.splice(index, 0, 0);
      item.homeworkGrades.splice(index, 0, 0);
    });
    this.saveStudentsGrades(grade);
  }

  deleteSubjectFromGrade(index: number): void {
    const grade = this.getAllStudentGrades();
    grade.forEach((item) => {
      item.lectureGrades.splice(index, 1);
      item.homeworkGrades.splice(index, 1);
    });
    this.saveStudentsGrades(grade);
  }

  updateItem(element: StudentsGrades, index: number): void {
    const grades = this.getAllStudentGrades();
    grades[index] = element;
    this.saveStudentsGrades(grades);
  }
}
