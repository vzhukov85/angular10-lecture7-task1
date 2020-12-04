import { Injectable } from '@angular/core';
import { JournalDaoService } from './journal-dao.service';

export interface SubjectElement {
  position: number;
  dateSubject: Date;
  topic: string;
  homework: string;
  notice: string;
}

export interface LessonDate {
  date: Date;
  count: number;
}

export interface JournalUpdate {
  updateColumns(): void;
}

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private journalCallback: JournalUpdate;
  constructor(private journalDaoSrv: JournalDaoService) {
  }

  addElement(element: SubjectElement): void {
    const subjects: SubjectElement[] = this.journalDaoSrv.getAllSubjects();
    this.updateSubjects(subjects, element);
    this.sortSubjects(subjects);
    const pos = this.findSubjIndex(subjects, element);
    this.journalDaoSrv.addSubjectFromGrade(pos);
    this.saveSubjects(subjects);
  }

  private findSubjIndex(subjects: SubjectElement[], element: SubjectElement): number {
    return subjects.findIndex((item, index, array) => {
      if (item.position === element.position) {
       return true;
      }
      return false;
    });
  }

  private saveSubjects(subjects: SubjectElement[]): void {
    this.journalDaoSrv.saveSubjects(subjects);
    if (this.journalCallback != null) {
      console.log('callback', this.subjects);
      this.journalCallback.updateColumns();
    }
  }

  private sortSubjects(subjects: SubjectElement[]): void {
    subjects.sort((t1, t2) => {
      if (t1.position > t2.position) {
        return 1;
      }
      if (t1.position < t2.position) {
        return -1;
      }
      return 0;
    });
  }

  private updateSubjects(
    subjects: SubjectElement[],
    element: SubjectElement
  ): void {
    let isExist = false;
    subjects.forEach((item, index) => {
      if (item.position === element.position) {
        subjects[index] = element;
        isExist = true;
      }
    });
    if (!isExist) {
      subjects.push(element);
    }
  }

  setJournalCallback(journal: JournalUpdate): void {
    this.journalCallback = journal;
  }

  delete(element: SubjectElement): void {
    const subjects = this.journalDaoSrv.getAllSubjects();
    const pos = this.findSubjIndex(subjects, element);
    const filteredSubjects = subjects.filter((item) => {
      return item.position !== element.position;
    });
    console.log(filteredSubjects);
    this.journalDaoSrv.deleteSubjectFromGrade(pos);
    this.saveSubjects(filteredSubjects);
  }

  get lessonDates(): Array<LessonDate> {
    const dates: LessonDate[] = [];
    this.journalDaoSrv.getAllSubjects().forEach((element) => {
      if (
        dates.length < 1 ||
        dates[dates.length - 1].date.getTime() !== element.dateSubject.getTime()
      ) {
        const lessonDate: LessonDate = {
          date: element.dateSubject,
          count: 1
        };
        dates.push(lessonDate);
      } else {
        ++dates[dates.length - 1].count;
      }
    });
    return dates;
  }

  get subjects(): SubjectElement[] {
    return this.journalDaoSrv.getAllSubjects();
  }
}
