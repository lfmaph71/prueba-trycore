import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Activity } from '../../../core/models/activity.model';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>{{ editingActivity ? 'Editar Actividad' : 'Crear Nueva Actividad' }}</h2>
      <form [formGroup]="activityForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Nombre de la Actividad *</label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="form-control"
            placeholder="Nombre de la actividad"
          />
          <span class="error" *ngIf="activityForm.get('name')?.hasError('required')">
            El nombre es requerido
          </span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="bac">BAC (Presupuesto Total) *</label>
            <input
              id="bac"
              type="number"
              formControlName="bac"
              class="form-control"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <span class="error" *ngIf="activityForm.get('bac')?.hasError('required')">
              BAC es requerido
            </span>
          </div>

          <div class="form-group">
            <label for="plannedPercent">% Planeado *</label>
            <input
              id="plannedPercent"
              type="number"
              formControlName="plannedPercent"
              class="form-control"
              placeholder="0"
              min="0"
              max="100"
            />
            <span class="error" *ngIf="activityForm.get('plannedPercent')?.hasError('required')">
              % Planeado es requerido
            </span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="actualPercent">% Real *</label>
            <input
              id="actualPercent"
              type="number"
              formControlName="actualPercent"
              class="form-control"
              placeholder="0"
              min="0"
              max="100"
            />
            <span class="error" *ngIf="activityForm.get('actualPercent')?.hasError('required')">
              % Real es requerido
            </span>
          </div>

          <div class="form-group">
            <label for="actualCost">AC (Costo Real) *</label>
            <input
              id="actualCost"
              type="number"
              formControlName="actualCost"
              class="form-control"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <span class="error" *ngIf="activityForm.get('actualCost')?.hasError('required')">
              AC es requerido
            </span>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            {{ editingActivity ? 'Actualizar' : 'Crear' }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="onCancel()">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h2 {
      margin-top: 0;
      color: #2c3e50;
    }
    .form-group {
      margin-bottom: 16px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
      color: #333;
    }
    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    .error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
      display: block;
    }
    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-primary {
      background-color: #3498db;
      color: white;
    }
    .btn-secondary {
      background-color: #e0e0e0;
      color: #333;
    }
  `]
})
export class ActivityFormComponent implements OnInit {
  @Input() editingActivity: Activity | null = null;
  @Output() activityCreated = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  activityForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activityForm = this.fb.group({
      name: ['', Validators.required],
      bac: [0, [Validators.required, Validators.min(0)]],
      plannedPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      actualPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      actualCost: [0, [Validators.required, Validators.min(0)]]
    });

    if (this.editingActivity) {
      this.activityForm.patchValue(this.editingActivity);
    }
  }

  onSubmit(): void {
    if (this.activityForm.valid) {
      this.activityCreated.emit(this.activityForm.value);
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
