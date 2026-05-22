import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { MetricCardComponent } from '../../../shared/components/metric-card/metric-card.component';
import { EvmStatusBadgeComponent } from '../../../shared/components/evm-status-badge/evm-status-badge.component';
import { EvmIndicators } from '../../../core/models/evm-indicators.model';

@Component({
  selector: 'app-evm-summary',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe, MetricCardComponent, EvmStatusBadgeComponent],
  template: `
    <div class="evm-summary">
      <h2>Indicadores EVM Consolidados</h2>
      <div class="metrics-grid">
        <app-metric-card
          title="PV (Valor Planeado)"
          [value]="indicators?.plannedValue | currencyFormat"
          label="Trabajo planeado"
        ></app-metric-card>

        <app-metric-card
          title="EV (Valor Ganado)"
          [value]="indicators?.earnedValue | currencyFormat"
          label="Trabajo completado"
        ></app-metric-card>

        <app-metric-card
          title="AC (Costo Real)"
          [value]="indicators?.actualCost | currencyFormat"
          label="Dinero gastado"
        ></app-metric-card>

        <app-metric-card
          title="CV (Varianza de Costo)"
          [value]="indicators?.costVariance | currencyFormat"
          label="Diferencia EV-AC"
        ></app-metric-card>

        <app-metric-card
          title="SV (Varianza de Cronograma)"
          [value]="indicators?.scheduleVariance | currencyFormat"
          label="Diferencia EV-PV"
        ></app-metric-card>

        <app-metric-card
          title="CPI (Índice de Desempeño de Costo)"
          [value]="(indicators?.costPerformanceIndex || 0).toFixed(2)"
          label="Eficiencia de costos"
        ></app-metric-card>

        <app-metric-card
          title="SPI (Índice de Desempeño de Cronograma)"
          [value]="(indicators?.schedulePerformanceIndex || 0).toFixed(2)"
          label="Eficiencia de cronograma"
        ></app-metric-card>

        <app-metric-card
          title="EAC (Estimación al Terminar)"
          [value]="indicators?.estimateAtCompletion | currencyFormat"
          label="Costo final estimado"
        ></app-metric-card>
      </div>

      <div class="interpretation-section" *ngIf="indicators">
        <div class="interpretation-item">
          <label>Estado de Costos:</label>
          <app-evm-status-badge 
            [interpretation]="indicators?.cpiInterpretation || ''"
            [value]="indicators?.costPerformanceIndex || 1"
          ></app-evm-status-badge>
        </div>
        <div class="interpretation-item">
          <label>Estado de Cronograma:</label>
          <app-evm-status-badge 
            [interpretation]="indicators?.spiInterpretation || ''"
            [value]="indicators?.schedulePerformanceIndex || 1"
          ></app-evm-status-badge>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .evm-summary {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h2 {
      margin-top: 0;
      color: #2c3e50;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    .interpretation-section {
      display: flex;
      gap: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
    .interpretation-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .interpretation-item label {
      font-weight: 600;
      color: #333;
    }
  `]
})
export class EvmSummaryComponent {
  @Input() indicators: EvmIndicators | null = null;
}
