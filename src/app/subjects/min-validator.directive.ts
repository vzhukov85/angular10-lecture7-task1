import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[min-value]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MinValidatorDirective,
      multi: true,
    },
  ],
})
export class MinValidatorDirective implements Validator {
  @Input('min-value') minValue: number;
  constructor() {}

  validate(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (value < this.minValue) {
      return {
        minValue: this.minValue,
        factValue: value,
      };
    }
    return null;
  }
}
