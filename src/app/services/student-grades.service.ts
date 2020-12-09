import { Injectable } from '@angular/core';
import { JournalDaoService } from './journal-dao.service';

export interface TotalGrades {
  absenceRate: number;
  totalCountHomeworks: number;
  totalGrades: number;
  interviewTotalGrades: number;
  percentLecture: number;
  percentHomework: number;
  finalExam: number;
}

export interface JournalGrades {
  fio: string;
  lectureGrades: Array<number>;
  homeworkGrades: Array<number>;
  interview: number;
  result: Result;
}

export interface Grades {
  journalGrades: JournalGrades;
  totalGrades: TotalGrades;
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

  get studentsGrades(): Grades[] {
    return this.journalDaoSrv.getAllStudentGrades();
  }

  get totalGrades(): TotalGrades[] {
    return this.journalDaoSrv.getAllTotalGrades();
  }

  get journalGrades(): JournalGrades[] {
    return this.journalDaoSrv.getAllJournalGrades();
  }

  addStudent(): Grades {

    const lectureGrades: number[] = [];
    const homeworkGrades: number[] = [];

    this.journalDaoSrv.getAllSubjects().forEach(element => {
      lectureGrades.push(0);
      homeworkGrades.push(0);
    });

    const journalGrades: JournalGrades = {
      fio: '',
      lectureGrades,
      homeworkGrades,
      interview: 0,
      result: null,
    };

    const totalGrades: TotalGrades = {
      absenceRate: 0,
      totalCountHomeworks: 0,
      totalGrades: 0,
      interviewTotalGrades: 0,
      percentLecture: 0,
      percentHomework: 0,
      finalExam: 0
    };

    this.recalcByElem(journalGrades, totalGrades);
    return {
      journalGrades,
      totalGrades
    };
  }

  get subjectColumns(): Array<string> {
    const lessonNames = [];
    this.journalDaoSrv.getAllSubjects().forEach(element => {
      lessonNames.push(element.topic);
    });
    return lessonNames;
  }

  recalc(journalGrades: JournalGrades, totalGrades: TotalGrades): void {
    this.recalcByElem(journalGrades, totalGrades);
  }

  recalcByElem(journalGrades: JournalGrades, totalGrades: TotalGrades): void {
    this.recalcAbsentRate(journalGrades, totalGrades);
    this.recalcHomeworks(journalGrades, totalGrades);
    this.recalcInteview(journalGrades, totalGrades);
    this.recalcFinal(totalGrades);
  }

  delete(index: number): void {
    const grades = this.studentsGrades;
    grades.splice(index, 1);
    this.journalDaoSrv.saveStudentsGrades(grades);
  }

  private recalcAbsentRate(journalGrades: JournalGrades, totalGrades: TotalGrades): void {
    totalGrades.absenceRate = 0;
    journalGrades.lectureGrades.forEach((val) => {
      if (val > 0) {
        ++totalGrades.absenceRate;
      }
    });
    totalGrades.percentLecture = totalGrades.absenceRate / journalGrades.lectureGrades.length;
  }

  private recalcHomeworks(journalGrades: JournalGrades, totalGrades: TotalGrades): void {
    totalGrades.totalCountHomeworks = 0;
    totalGrades.totalGrades = 0;
    journalGrades.homeworkGrades.forEach((val) => {
      if (val > 0) {
        ++totalGrades.totalCountHomeworks;
        totalGrades.totalGrades += val;
      }
    });
    totalGrades.percentHomework = totalGrades.totalCountHomeworks / journalGrades.homeworkGrades.length;
  }

  private recalcInteview(journalGrades: JournalGrades, totalGrades: TotalGrades): void {
    totalGrades.interviewTotalGrades = totalGrades.totalGrades;
    if (journalGrades.interview >= 60) {
      totalGrades.interviewTotalGrades *= 2;
    }
  }

  private recalcFinal(totalGrades: TotalGrades): void {
    totalGrades.finalExam = totalGrades.interviewTotalGrades / 100;
  }

  save(grades: Grades[]) {
    this.journalDaoSrv.saveStudentsGrades(grades);
  }

  addSubjectFromGrade(index: number): void {
    const grade = this.journalDaoSrv.getAllStudentGrades();
    grade.forEach((item) => {
      item.journalGrades.lectureGrades.splice(index, 0, 0);
      item.journalGrades.homeworkGrades.splice(index, 0, 0);
      this.recalc(item.journalGrades, item.totalGrades);
    });
    this.journalDaoSrv.saveStudentsGrades(grade);
  }

  deleteSubjectFromGrade(index: number): void {
    const grade = this.journalDaoSrv.getAllStudentGrades();
    grade.forEach((item) => {
      item.journalGrades.lectureGrades.splice(index, 1);
      item.journalGrades.homeworkGrades.splice(index, 1);
      this.recalc(item.journalGrades, item.totalGrades);
    });
    this.journalDaoSrv.saveStudentsGrades(grade);
  }

}
