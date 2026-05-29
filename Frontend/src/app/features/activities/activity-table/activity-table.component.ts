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
  templateUrl: `./activity-table.component.html`,
  styleUrls: [`./activity-table.component.css`],
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
