import { Injectable } from '@angular/core';
import { DateColumns } from '../students/students-table/students-table.component';
import { LessonDate, SubjectService } from './subject.service';

export interface JournalHeader {
  fullColumnDefs: string[];
  mainColumnsDefs: string[];
  startDatesColumnDefs: string[];
  endDatesColumnDefs: string[];
  subjectColumnTitle: string[];
  homeworkColumnDefs: string[];
  lessonColumnDefs: string[];
  lessonDates: DateColumns[];
  startHomeworkDates: DateColumns[];
  endHomeworkDates: DateColumns[];

  lessonStartDate: Date;
  lessonEndDate: Date;
  interviewStartDate: Date;
  interviewEndDate: Date;
  finalExamStartDate: Date;
  finalExamEndDate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class JournalHeaderService {
  constructor(private subjectSrv: SubjectService) {}

  updateColumns(): JournalHeader {
    return this.fillHeaderDates();
  }

  private fillHeaderDates(): JournalHeader {
    const lessonDatesBase = this.subjectSrv.lessonDates;
    if (lessonDatesBase.length === 0) {
      lessonDatesBase.push({
        date: new Date(),
        count: 0,
      });
    }
    const firstDate = lessonDatesBase[0].date;
    const lastDate = lessonDatesBase[lessonDatesBase.length - 1].date;
    const lessonDates = this.fillDates(lessonDatesBase, 'lesson-date-', 0);
    const startHomeworkDates = this.fillDates(
      lessonDatesBase,
      'start-homework-date-',
      0
    );
    const endHomeworkDates = this.fillDates(
      lessonDatesBase,
      'end-homework-date-',
      7
    );

    const lessonStartDate = firstDate;
    const lessonEndDate = lastDate;
    let interviewStartDate = this.addDays(firstDate, 14);
    const interviewEndDate = this.addDays(lastDate, 7);
    if (interviewStartDate.getTime() > interviewEndDate.getTime()) {
      interviewStartDate = interviewEndDate;
    }
    const finalExamStartDate = this.addDays(lastDate, 7);
    const finalExamEndDate = this.addDays(lastDate, 7);

    const subjectColumnTitle = this.getSubjectColumnTitle();
    const lessonColumnDefs = this.columnDefs('lesson');
    const homeworkColumnDefs = this.columnDefs('homework');
    const fullColumnDefs = this.getFullColumnDefs(
      lessonColumnDefs,
      homeworkColumnDefs
    );
    const startDatesColumnDefs = this.getStartDatesColumnDefs(
      lessonDates,
      startHomeworkDates
    );
    const endDatesColumnDefs = this.getEndDatesColumnDefs(
      lessonDates,
      endHomeworkDates
    );
    const mainColumnsDefs = this.getMainCoumntDefs();

    return {
      fullColumnDefs,
      mainColumnsDefs,
      startDatesColumnDefs,
      endDatesColumnDefs,
      subjectColumnTitle,
      homeworkColumnDefs,
      lessonColumnDefs,
      lessonDates,
      startHomeworkDates,
      endHomeworkDates,

      lessonStartDate,
      lessonEndDate,
      interviewStartDate,
      interviewEndDate,
      finalExamStartDate,
      finalExamEndDate,
    };
  }

  private getMainCoumntDefs(): string[] {
    return [
      'fio-group',
      'lesson-group',
      'absence-rate',
      'homework-group',
      'total-count-homework-group',
      'total-grades-group',
      'interview-title',
      'interview-total-grades-group',
      'max-total-grades-group',
      'percent-lecture-title',
      'percent-homework-title',
      'final-exam-title',
      'result-group',
      'delete-group',
    ];
  }

  private getSubjectColumnTitle(): Array<string> {
    const lessonNames = [];
    this.subjectSrv.subjects.forEach((element) => {
      lessonNames.push(element.topic);
    });
    if (lessonNames.length === 0) {
      lessonNames.push('Урок 1');
    }
    return lessonNames;
  }

  private getFullColumnDefs(
    lessonColumnDefs: string[],
    homeworkColumnDefs: string[]
  ): string[] {
    let columnDefs = [];
    columnDefs.push('fio');
    columnDefs = columnDefs.concat(lessonColumnDefs);
    columnDefs.push('absence-rate-info');
    columnDefs = columnDefs.concat(homeworkColumnDefs);
    columnDefs.push('total-count-homework');
    columnDefs.push('total-grades');
    columnDefs.push('interview-min-val');
    columnDefs.push('interview-total-grades');
    columnDefs.push('max-total-grades');
    columnDefs.push('percent-lecture');
    columnDefs.push('percent-homework');
    columnDefs.push('final-exam-min');
    columnDefs.push('result');
    columnDefs.push('delete');
    return columnDefs;
  }

  private fillDates(
    dates: LessonDate[],
    prefix: string,
    addDays: number
  ): DateColumns[] {
    const resDates = [];
    let count = 0;
    dates.forEach((element) => {
      resDates.push({
        date: this.addDays(element.date, addDays),
        colDef: prefix + count,
        count: element.count,
      });
      count++;
    });
    return resDates;
  }

  private addDays(date: Date, days: number): Date {
    const nextWeek = new Date(date.valueOf());
    nextWeek.setDate(nextWeek.getDate() + days);
    return nextWeek;
  }

  private getStartDatesColumnDefs(
    lessonDates: DateColumns[],
    startHomeworkDates: DateColumns[]
  ): string[] {
    const columnDefs = [];
    columnDefs.push('fio');
    lessonDates.forEach((element) => {
      columnDefs.push('start-' + element.colDef);
    });
    columnDefs.push('absence-rate-start-date');
    startHomeworkDates.forEach((element) => {
      columnDefs.push(element.colDef);
    });
    columnDefs.push('interview-start-date');
    columnDefs.push('final-exam-start-date');
    return columnDefs;
  }

  private getEndDatesColumnDefs(
    lessonDates: DateColumns[],
    endHomeworkDates: DateColumns[]
  ): string[] {
    const columnDefs = [];
    columnDefs.push('fio');
    lessonDates.forEach((element) => {
      columnDefs.push('end-' + element.colDef);
    });
    columnDefs.push('absence-rate-end-date');
    endHomeworkDates.forEach((element) => {
      columnDefs.push(element.colDef);
    });
    columnDefs.push('interview-end-date');
    columnDefs.push('percent-lecture-min');
    columnDefs.push('percent-homework-min');
    columnDefs.push('final-exam-end-date');
    return columnDefs;
  }

  private columnDefs(prefix: string): string[] {
    const columns = [];
    let count = 0;
    this.subjectSrv.subjects.forEach(() => {
      columns.push(prefix + count++);
    });
    if (columns.length === 0) {
      columns.push(prefix + count++);
    }
    return columns;
  }
}
