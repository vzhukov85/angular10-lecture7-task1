import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[max-value]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MaxValidatorDirective,
      multi: true,
    },
  ],
})
export class MaxValidatorDirective implements Validator {
  @Input('max-value') maxValue: number;
  constructor() {}

  validate(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    if (value > this.maxValue) {
      return {
        minValue: this.maxValue,
        factValue: value,
      };
    }
    return null;
  }
}
