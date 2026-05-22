import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentFormat',
  standalone: true
})
export class PercentFormatPipe implements PipeTransform {
  transform(value: number | null | undefined, decimals: number = 2): string {
    if (value === null || value === undefined) {
      return '0.00%';
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100);
  }
}
