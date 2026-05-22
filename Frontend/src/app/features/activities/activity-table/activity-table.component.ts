import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { PercentFormatPipe } from '../../../shared/pipes/percent-format.pipe';
import { EvmStatusBadgeComponent } from '../../../shared/components/evm-status-badge/evm-status-badge.component';
import { Activity } from '../../../core/models/activity.model';

@Component({
  selector: 'app-activity-table',
  standalone: true,
imports: [CommonModule, CurrencyFormatPipe, EvmStatusBadgeComponent],
  template: `
    <div class="activities-section">
      <div class="section-header">
        <h2>Actividades</h2>
        <button class="btn btn-primary" (click)="onNewActivity()">+ Nueva Actividad</button>
      </div>

      <div *ngIf="activities.length === 0" class="empty-state">
        <p>No hay actividades. ¡Crea una para comenzar!</p>
      </div>

      <div *ngIf="activities.length > 0" class="activities-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>BAC</th>
              <th>% Planeado</th>
              <th>% Real</th>
              <th>AC</th>
              <th>PV</th>
              <th>EV</th>
              <th>CV</th>
              <th>CPI</th>
              <th>SPI</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let activity of activities">
              <td>{{ activity.name }}</td>
              <td>{{ activity.bac | currencyFormat }}</td>
              <td>{{ activity.plannedPercent }}%</td>
              <td>{{ activity.actualPercent }}%</td>
              <td>{{ activity.actualCost | currencyFormat }}</td>
              <td>{{ activity.indicators?.plannedValue | currencyFormat }}</td>
              <td>{{ activity.indicators?.earnedValue | currencyFormat }}</td>
              <td [ngClass]="{'negative': (activity.indicators?.costVariance || 0) < 0}">
                {{ activity.indicators?.costVariance | currencyFormat }}
              </td>
              <td>
                <app-evm-status-badge 
                  [interpretation]="activity.indicators?.cpiInterpretation || ''"
                  [value]="activity.indicators?.costPerformanceIndex || 1"
                ></app-evm-status-badge>
              </td>
              <td>
                <app-evm-status-badge 
                  [interpretation]="activity.indicators?.spiInterpretation || ''"
                  [value]="activity.indicators?.schedulePerformanceIndex || 1"
                ></app-evm-status-badge>
              </td>
              <td class="actions">
                <button class="btn-small btn-info" (click)="onEditActivity(activity)">Editar</button>
                <button class="btn-small btn-danger" (click)="onDeleteActivity(activity.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .activities-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-top: 20px;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .section-header h2 {
      margin: 0;
      color: #2c3e50;
    }
    .btn-primary {
      background-color: #27ae60;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
    }
    .activities-table {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
    }
    tr:hover {
      background-color: #fafafa;
    }
    .negative {
      color: #e74c3c;
      font-weight: bold;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    .btn-small {
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
      white-space: nowrap;
    }
    .btn-info {
      background-color: #3498db;
      color: white;
    }
    .btn-danger {
      background-color: #e74c3c;
      color: white;
    }
  `]
})
export class ActivityTableComponent {
  @Input() activities: Activity[] = [];
  @Output() newActivity = new EventEmitter<void>();
  @Output() editActivity = new EventEmitter<Activity>();
  @Output() deleteActivity = new EventEmitter<number>();

  onNewActivity(): void {
    this.newActivity.emit();
  }

  onEditActivity(activity: Activity): void {
    this.editActivity.emit(activity);
  }

  onDeleteActivity(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta actividad?')) {
      this.deleteActivity.emit(id);
    }
  }
}
