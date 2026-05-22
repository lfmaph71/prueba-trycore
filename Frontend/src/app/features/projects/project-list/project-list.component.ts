import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { EvmStatusBadgeComponent } from '../../../shared/components/evm-status-badge/evm-status-badge.component';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe, EvmStatusBadgeComponent],
  template: `
    <div class="projects-section">
      <div class="section-header">
        <h2>Proyectos</h2>
        <button class="btn btn-primary" (click)="onNewProject()">+ Nuevo Proyecto</button>
      </div>

      <div *ngIf="projects.length === 0" class="empty-state">
        <p>No hay proyectos. ¡Crea uno para comenzar!</p>
      </div>

      <div *ngIf="projects.length > 0" class="projects-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>EV Consolidado</th>
              <th>CPI</th>
              <th>SPI</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let project of projects">
              <td>{{ project.name }}</td>
              <td>{{ project.description || '-' }}</td>
              <td>{{ project.evmSummary?.earnedValue | currencyFormat }}</td>
              <td>{{ project.evmSummary?.costPerformanceIndex?.toFixed(2) || '-' }}</td>
              <td>{{ project.evmSummary?.schedulePerformanceIndex?.toFixed(2) || '-' }}</td>
              <td class="actions">
                <button class="btn-small btn-info" (click)="onSelectProject(project)">Ver</button>
                <button class="btn-small btn-danger" (click)="onDeleteProject(project.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .projects-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    .projects-table {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
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
    .actions {
      display: flex;
      gap: 8px;
    }
    .btn-small {
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
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
export class ProjectListComponent {
  @Input() projects: Project[] = [];
  @Output() newProject = new EventEmitter<void>();
  @Output() selectProject = new EventEmitter<Project>();
  @Output() deleteProject = new EventEmitter<number>();

  onNewProject(): void {
    this.newProject.emit();
  }

  onSelectProject(project: Project): void {
    this.selectProject.emit(project);
  }

  onDeleteProject(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este proyecto?')) {
      this.deleteProject.emit(id);
    }
  }
}
