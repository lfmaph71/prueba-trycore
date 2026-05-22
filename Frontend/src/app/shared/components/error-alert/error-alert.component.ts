import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" class="alert alert-error">
      <div class="alert-content">
        <span class="alert-icon">⚠️</span>
        <span>{{ message }}</span>
      </div>
      <button class="alert-close" (click)="close()">✕</button>
    </div>
  `,
  styles: [`
    .alert {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      padding: 12px 16px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .alert-error {
      color: #721c24;
    }
    .alert-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .alert-icon {
      font-size: 18px;
    }
    .alert-close {
      background: none;
      border: none;
      color: #721c24;
      cursor: pointer;
      font-size: 18px;
      padding: 0;
    }
  `]
})
export class ErrorAlertComponent {
  @Input() message: string = 'Error occurred';
  @Input() visible: boolean = true;
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.visible = false;
    this.closed.emit();
  }
}
