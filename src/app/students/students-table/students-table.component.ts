import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { JournalUpdate, SubjectService } from '../../services/subject.service';
import {
  Grades,
  JournalGrades,
  Result,
  StudentGradesService,
  TotalGrades,
} from '../../services/student-grades.service';
import {
  FormArray,
  FormBuilder,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
import {
  JournalHeader,
  JournalHeaderService,
} from '../../services/journal-header.service';

export interface DateColumns {
  date: Date;
  colDef: string;
  count: number;
}

@Component({
  selector: 'students-table',
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.css'],
})
export class StudentsTableComponent implements OnInit, JournalUpdate {
  studentsGrades: MatTableDataSource<any>;
  public ResultEnum = Result;

  studentTable: FormGroup;
  studentData: TotalGrades[];
  headers: JournalHeader;

  constructor(
    private studentsGradesSrv: StudentGradesService,
    private subjectSrv: SubjectService,
    private fb: FormBuilder,
    private journalHeaderSrv: JournalHeaderService
  ) {
    this.subjectSrv.setJournalCallback(this);
  }

  ngOnInit(): void {
    this.updateColumns();
  }

  updateColumns(): void {
    this.headers = this.journalHeaderSrv.updateColumns();

    this.reloadStudents();
  }

  recalcGrades(element: FormGroup, index: number): void {
    const journalGrades: JournalGrades = this.toJournalGrade(element);
    const totalGrades: TotalGrades = this.studentData[index];
    this.studentsGradesSrv.recalc(journalGrades, totalGrades);
  }

  private toJournalGrade(data: FormGroup): JournalGrades {
    const controls = data.controls;
    const lectureGrades: number[] = (controls.lectureGrades as FormArray).controls.map((item) => item.value);
    const homeworkGrades: number[] = (controls.homeworkGrades as FormArray).controls.map((item) => item.value);
    return {
      fio: controls.fio.value,
      lectureGrades,
      homeworkGrades,
      interview: controls.interview.value,
      result: controls.result.value,
    };
  }

  delete(index: number): void {
    this.studentData.splice(index, 1);
    this.studentsGradesSrv.delete(index);
    const journalGrades: AbstractControl[] = this.getFormArray().controls;
    journalGrades.splice(index, 1);
    this.studentsGrades = new MatTableDataSource(journalGrades);
  }

  cancel(): void {
    this.reloadStudents();
  }

  addItem(): void {
    const studentGrades: Grades = this.studentsGradesSrv.addStudent();
    this.studentData.push(studentGrades.totalGrades);
    const row: FormGroup = this.initRow(studentGrades.journalGrades);
    this.getFormArray().controls.push(row);
    this.studentsGrades = new MatTableDataSource(this.getFormArray().controls);
  }

  reloadStudents(): void {
    this.studentData = this.studentsGradesSrv.totalGrades;
    const journalGrades = this.studentsGradesSrv.journalGrades;
    const studentRows = this.fb.array(journalGrades.map((element) => this.initRow(element)));
    this.studentTable = this.fb.group({
      tableRows: studentRows,
    });
    this.studentsGrades = new MatTableDataSource(this.getFormArray().controls);
  }

  private initRow(data: JournalGrades): FormGroup {
    const lectureGrades = this.fb.array(
      data.lectureGrades.map((item) =>
        this.fb.control(item, { updateOn: 'change' })
      )
    );
    const homeworkGrades = this.fb.array(
      data.homeworkGrades.map((item) =>
        this.fb.control(item, { updateOn: 'change' })
      )
    );
    return this.fb.group({
      fio: [data.fio, { updateOn: 'change' }],
      lectureGrades,
      homeworkGrades,
      interview: [data.interview, { updateOn: 'change' }],
      result: [data.result, { updateOn: 'change' }],
    });
  }

  save() {
    this.getFormArray().updateValueAndValidity();
    this.getFormArray().markAllAsTouched();
    if (!this.studentTable.valid) {
      return;
    }
    const grades: Grades[] = this.studentsGrades.data.map<Grades>(
      (item, index) => {
        const controls = item.controls;
        const lectureGrades = controls.lectureGrades.controls.map((item) => item.value);
        const homeworkGrades = controls.homeworkGrades.controls.map((item) => item.value);
        const journalGrades = {
          fio: controls.fio.value,
          lectureGrades, 
          homeworkGrades,
          interview: controls.interview.value,
          result: controls.result.value,
        };
        const totalGrades = this.studentData[index];
        return {
          journalGrades,
          totalGrades,
        };
      }
    );
    this.studentsGradesSrv.save(grades);
  }

  private getFormArray() {
    return (this.studentTable.controls.tableRows as FormArray);
  }
}
