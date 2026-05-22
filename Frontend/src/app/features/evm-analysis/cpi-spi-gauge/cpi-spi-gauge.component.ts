import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { EvmIndicators } from '../../../core/models/evm-indicators.model';

@Component({
  selector: 'app-cpi-spi-gauge',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="gauge-container">
      <h3>Indicadores de Salud: CPI y SPI</h3>
      <div class="gauges-wrapper">
        <div class="gauge">
          <h4>CPI (Desempeño de Costos)</h4>
          <canvas
            baseChart
            [data]="cpiChartData"
            [options]="gaugeOptions"
            type="doughnut"
          ></canvas>
          <p class="gauge-value">{{ (indicators?.costPerformanceIndex || 0).toFixed(2) }}</p>
          <p class="gauge-label">{{ indicators?.cpiInterpretation || '' }}</p>
        </div>

        <div class="gauge">
          <h4>SPI (Desempeño de Cronograma)</h4>
          <canvas
            baseChart
            [data]="spiChartData"
            [options]="gaugeOptions"
            type="doughnut"
          ></canvas>
          <p class="gauge-value">{{ (indicators?.schedulePerformanceIndex || 0).toFixed(2) }}</p>
          <p class="gauge-label">{{ indicators?.spiInterpretation || '' }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gauge-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-top: 20px;
    }
    h3 {
      margin-top: 0;
      color: #2c3e50;
    }
    .gauges-wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
    }
    .gauge {
      text-align: center;
    }
    h4 {
      margin: 0 0 15px 0;
      color: #333;
    }
    .gauge-value {
      font-size: 28px;
      font-weight: bold;
      margin: 10px 0 0 0;
      color: #2c3e50;
    }
    .gauge-label {
      margin: 5px 0 0 0;
      color: #666;
      font-size: 14px;
    }
  `]
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
