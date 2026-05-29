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
  templateUrl: `./evm-summary.component.html`,
  styleUrls: [`./evm-summary.component.css`],
})
export class EvmSummaryComponent {
  @Input() indicators: EvmIndicators | null = null;
}
