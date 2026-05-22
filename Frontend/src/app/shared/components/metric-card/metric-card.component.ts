import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metric-card">
      <div class="metric-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="metric-value">
        {{ value }}
      </div>
      <div class="metric-label">
        {{ label }}
      </div>
    </div>
  `,
  styles: [`
    .metric-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .metric-header h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #666;
      font-weight: 600;
    }
    .metric-value {
      font-size: 28px;
      font-weight: bold;
      color: #2c3e50;
      margin: 10px 0;
    }
    .metric-label {
      font-size: 12px;
      color: #999;
    }
  `]
})
export class MetricCardComponent {
  @Input() title: string = '';
  @Input() value: any = '-';
  @Input() label: string = '';
}
