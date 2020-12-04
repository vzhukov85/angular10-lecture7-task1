import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[date-validator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DateValidatorDirective,
      multi: true,
    },
  ],
})
export class DateValidatorDirective implements Validator {
  constructor() {}

  validate(control: AbstractControl): { [key: string]: any } {
    const date: Date = new Date(control.value);
    const today: Date = new Date(new Date().setHours(0, 0, 0, 0));
    if (date.getTime() < today.getTime()) {
      return { dateBeforeNow: true };
    }
    return null;
  }
}
