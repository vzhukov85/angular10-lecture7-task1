import { NgModule } from '@angular/core';
import { MinValidatorDirective } from './min-validator.directive';
import { MaxValidatorDirective } from './max-validator.directive';

@NgModule({
  declarations: [MinValidatorDirective, MaxValidatorDirective],
  imports: [],
  exports: [MinValidatorDirective, MaxValidatorDirective],
})
export class ShareModule {}
