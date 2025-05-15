import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanWriteDirective} from "./can-write.directive";




@NgModule({
  declarations: [CanWriteDirective],
  imports: [
    CommonModule
  ],
  exports: [CanWriteDirective]
})
export class DirectiveModule { }
