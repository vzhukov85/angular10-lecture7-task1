import { Injectable } from '@angular/core';
import { JournalDaoService } from './journal-dao.service';

export interface StudentsGrades {
  fio: string;
  lectureGrades: Array<number>;
  absenceRate: number;
  homeworkGrades: Array<number>;
  totalCountHomeworks: number;
  totalGrades: number;
  interview: number;
  interviewTotalGrades: number;
  percentLecture: number;
  percentHomework: number;
  finalExam: number;
  result: Result;
}

export enum Result {
  PASS = 'Зачет',
  NOT_PASS = 'Не зачет',
  DISMISS = 'Отчислен',
}

@Injectable({
  providedIn: 'root',
})
export class StudentGradesService {

  constructor(private journalDaoSrv: JournalDaoService) {
  }

  get studentsGrades(): StudentsGrades[] {
    return this.journalDaoSrv.getAllStudentGrades();
  }

  addStudent(): void {

    const lectureGrades: number[] = [];
    const homeworkGrades: number[] = [];

    this.journalDaoSrv.getAllSubjects().forEach(element => {
      lectureGrades.push(0);
      homeworkGrades.push(0);
    });

    const student: StudentsGrades = {
      fio: '',
      lectureGrades,
      absenceRate: 0,
      homeworkGrades,
      totalCountHomeworks: 0,
      totalGrades: 0,
      interview: 0,
      interviewTotalGrades: 0,
      percentLecture: 0,
      percentHomework: 0,
      finalExam: 0,
      result: null,
    };

    this.recalcByElem(student);
    const grades = this.studentsGrades;
    grades.push(student);
    this.journalDaoSrv.saveStudentsGrades(grades);
  }

  get subjectColumns(): Array<string> {
    const lessonNames = [];
    this.journalDaoSrv.getAllSubjects().forEach(element => {
      lessonNames.push(element.topic);
    });
    return lessonNames;
  }

  recalc(element: StudentsGrades, index: number): void {
    this.recalcByElem(element);
    this.journalDaoSrv.updateItem(element, index);
  }

  recalcByElem(grades: StudentsGrades): void {
    this.recalcAbsentRate(grades);
    this.recalcHomeworks(grades);
    this.recalcInteview(grades);
    this.recalcFinal(grades);
  }

  delete(index: number): void {
    const grades = this.studentsGrades;
    grades.splice(index, 1);
    this.journalDaoSrv.saveStudentsGrades(grades);
  }

  private recalcAbsentRate(grades: StudentsGrades): void {
    grades.absenceRate = 0;
    grades.lectureGrades.forEach((val) => {
      if (val > 0) {
        ++grades.absenceRate;
      }
    });
    grades.percentLecture = grades.absenceRate / grades.lectureGrades.length;
  }

  private recalcHomeworks(grades: StudentsGrades): void {
    grades.totalCountHomeworks = 0;
    grades.totalGrades = 0;
    grades.homeworkGrades.forEach((val) => {
      if (val > 0) {
        ++grades.totalCountHomeworks;
        grades.totalGrades += val;
      }
    });
    grades.percentHomework = grades.totalCountHomeworks / grades.homeworkGrades.length;
  }

  private recalcInteview(grades: StudentsGrades): void {
    grades.interviewTotalGrades = grades.totalGrades;
    if (grades.interview >= 60) {
      grades.interviewTotalGrades *= 2;
    }
  }

  private recalcFinal(grades: StudentsGrades): void {
    grades.finalExam = grades.interviewTotalGrades / 100;
  }

  updateItem(element: StudentsGrades, index: number): void {
    this.journalDaoSrv.updateItem(element, index);
  }


}
