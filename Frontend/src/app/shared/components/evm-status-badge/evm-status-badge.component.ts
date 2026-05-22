import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpiInterpretation, SpiInterpretation, HealthStatus } from '../../../core/models/enums';

@Component({
  selector: 'app-evm-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="'badge badge-' + getHealthStatus()">
      {{ interpretation }}
    </div>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 12px;
      text-align: center;
    }
    .badge-healthy {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .badge-warning {
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }
    .badge-critical {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  `]
})
export class EvmStatusBadgeComponent {
  @Input() interpretation: string = '';
  @Input() value: number = 1;

  getHealthStatus(): HealthStatus {
    if (this.value >= 1) {
      return HealthStatus.HEALTHY;
    } else if (this.value >= 0.8) {
      return HealthStatus.WARNING;
    }
    return HealthStatus.CRITICAL;
  }
}
