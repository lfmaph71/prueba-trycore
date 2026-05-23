import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe],
  template: `
    <div class="projects-section">
      <div class="section-header">
        <div>
          <h2>Proyectos</h2>
          <p class="section-description">Selecciona un proyecto para ver su análisis y abre la gestión de actividades cuando la necesites.</p>
        </div>
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
                <button class="btn-small btn-secondary" (click)="onOpenActivities(project)">Actividades</button>
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
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 20px;
    }
    .section-header h2 {
      margin: 0;
      color: #0f172a;
    }
    .section-description {
      margin: 6px 0 0;
      color: #64748b;
      font-size: 14px;
    }
    .btn-primary {
      background-color: #27ae60;
      color: white;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 700;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #94a3b8;
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
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      background-color: #f8fafc;
      font-weight: 700;
      color: #334155;
    }
    tr:hover {
      background-color: #f8fafc;
    }
    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .btn-small {
      padding: 6px 10px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
    }
    .btn-info {
      background-color: #0ea5e9;
      color: white;
    }
    .btn-secondary {
      background-color: #e2e8f0;
      color: #0f172a;
    }
    .btn-danger {
      background-color: #ef4444;
      color: white;
    }
  `]
})
export class ProjectListComponent {
  @Input() projects: Project[] = [];
  @Output() newProject = new EventEmitter<void>();
  @Output() selectProject = new EventEmitter<Project>();
  @Output() openActivities = new EventEmitter<Project>();
  @Output() deleteProject = new EventEmitter<number>();

  onNewProject(): void {
    this.newProject.emit();
  }

  onSelectProject(project: Project): void {
    this.selectProject.emit(project);
  }

  onOpenActivities(project: Project): void {
    this.openActivities.emit(project);
  }

  onDeleteProject(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este proyecto?')) {
      this.deleteProject.emit(id);
    }
  }
}
