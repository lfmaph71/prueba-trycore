import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Activity } from '../../../core/models/activity.model';

@Component({
  selector: 'app-pv-ev-ac-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-container">
      <h3>Comparación: PV vs EV vs AC por Actividad</h3>
      <canvas
        baseChart
        [data]="chartData"
        [options]="chartOptions"
        type="bar"
      ></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
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
  `]
})
export class PvEvAcChartComponent implements OnChanges {
  @Input() activities: Activity[] = [];

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'PV (Valor Planeado)',
        data: [],
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
        borderWidth: 1
      },
      {
        label: 'EV (Valor Ganado)',
        data: [],
        backgroundColor: '#2ecc71',
        borderColor: '#27ae60',
        borderWidth: 1
      },
      {
        label: 'AC (Costo Real)',
        data: [],
        backgroundColor: '#e74c3c',
        borderColor: '#c0392b',
        borderWidth: 1
      }
    ]
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Monto ($)'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activities']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    const labels = this.activities.map(a => a.name);
    const pvData = this.activities.map(a => a.indicators?.plannedValue || 0);
    const evData = this.activities.map(a => a.indicators?.earnedValue || 0);
    const acData = this.activities.map(a => a.actualCost || 0);

    this.chartData.labels = labels;
    (this.chartData.datasets[0].data as number[]) = pvData;
    (this.chartData.datasets[1].data as number[]) = evData;
    (this.chartData.datasets[2].data as number[]) = acData;
  }
}
