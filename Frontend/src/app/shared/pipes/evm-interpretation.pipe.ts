import { Pipe, PipeTransform } from '@angular/core';
import { CpiInterpretation, SpiInterpretation } from '../../core/models/enums';

@Pipe({
  name: 'evmInterpretation',
  standalone: true
})
export class EvmInterpretationPipe implements PipeTransform {
  transform(value: CpiInterpretation | SpiInterpretation | string): string {
    if (!value) return '';
    return String(value);
  }
}
