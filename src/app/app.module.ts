import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SubjectsModule } from './subjects/subjects.module';
import { MatTabsModule } from '@angular/material/tabs';
import { StudentsModule } from './students/students.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    SubjectsModule,
    StudentsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
