import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>{{ isEdit ? 'Editar Proyecto' : 'Crear Nuevo Proyecto' }}</h2>
      <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Nombre del Proyecto *</label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="form-control"
            placeholder="Nombre del proyecto"
          />
          <span class="error" *ngIf="projectForm.get('name')?.hasError('required')">
            El nombre es requerido
          </span>
        </div>

        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea
            id="description"
            formControlName="description"
            class="form-control"
            placeholder="Descripción del proyecto"
            rows="4"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            {{ isEdit ? 'Actualizar' : 'Crear' }}
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
export class ProjectFormComponent implements OnInit {
  @Output() projectCreated = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  projectForm!: FormGroup;
  isEdit = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.projectCreated.emit(this.projectForm.value);
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
