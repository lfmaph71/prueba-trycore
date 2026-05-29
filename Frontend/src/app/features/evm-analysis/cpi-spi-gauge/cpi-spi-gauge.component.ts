import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { EvmIndicators } from '../../../core/models/evm-indicators.model';

@Component({
  selector: 'app-cpi-spi-gauge',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: `./cpi-spi-gauge.component.html`,
  styleUrls: [`./cpi-spi-gauge.component.css`],
})
export class CpiSpiGaugeComponent {
  @Input() indicators: EvmIndicators | null = null;

  cpiChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Eficiente', 'Ineficiente'],
    datasets: [
      {
        data: [1, 0],
        backgroundColor: ['#2ecc71', '#e74c3c'],
        borderColor: ['#27ae60', '#c0392b'],
        borderWidth: 2
      }
    ]
  };

  spiChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Adelantado', 'Retrasado'],
    datasets: [
      {
        data: [1, 0],
        backgroundColor: ['#2ecc71', '#e74c3c'],
        borderColor: ['#27ae60', '#c0392b'],
        borderWidth: 2
      }
    ]
  };

  gaugeOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    }
  };
}
