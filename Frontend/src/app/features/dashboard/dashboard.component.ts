import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../core/services/project.service';
import { ActivityService } from '../../core/services/activity.service';
import { Project } from '../../core/models/project.model';
import { Activity } from '../../core/models/activity.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';
import { ProjectListComponent } from '../projects/project-list/project-list.component';
import { ProjectFormComponent } from '../projects/project-form/project-form.component';
import { ActivityTableComponent } from '../activities/activity-table/activity-table.component';
import { ActivityFormComponent } from '../activities/activity-form/activity-form.component';
import { EvmSummaryComponent } from '../evm-analysis/evm-summary/evm-summary.component';
import { PvEvAcChartComponent } from '../evm-analysis/pv-ev-ac-chart/pv-ev-ac-chart.component';
import { CpiSpiGaugeComponent } from '../evm-analysis/cpi-spi-gauge/cpi-spi-gauge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    ErrorAlertComponent,
    ProjectListComponent,
    ProjectFormComponent,
    ActivityTableComponent,
    ActivityFormComponent,
    EvmSummaryComponent,
    PvEvAcChartComponent,
    CpiSpiGaugeComponent
  ],
  template: `
    <div class="dashboard-container">
      <app-error-alert
        *ngIf="error"
        [message]="error"
        [visible]="true"
        (closed)="error = ''"
      ></app-error-alert>

      <!-- Modal Crear Proyecto -->
      <div *ngIf="showCreateProjectForm" class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close" (click)="cancelCreateProject()">✕</button>
          <app-project-form
            (projectCreated)="onProjectCreated($event)"
            (cancelled)="cancelCreateProject()"
          ></app-project-form>
        </div>
      </div>

      <!-- Modal Crear/Editar Actividad -->
      <div *ngIf="showCreateActivityForm" class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close" (click)="cancelCreateActivity()">✕</button>
          <app-activity-form
            [editingActivity]="editingActivity"
            (activityCreated)="onActivityCreated($event)"
            (cancelled)="cancelCreateActivity()"
          ></app-activity-form>
        </div>
      </div>

      <div *ngIf="loading" class="loading-overlay">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <!-- Contenido Principal -->
      <div *ngIf="!loading" class="dashboard-content">
        <!-- Sección 1: Proyectos -->
        <app-project-list
          [projects]="projects"
          (newProject)="showCreateProjectFormModal()"
          (selectProject)="onSelectProject($event)"
          (deleteProject)="onDeleteProject($event)"
        ></app-project-list>

        <!-- Sección 2: Indicadores EVM Consolidados -->
        <app-evm-summary
          *ngIf="selectedProject?.evmSummary !== undefined && selectedProject?.evmSummary !== null"
          [indicators]="selectedProject?.evmSummary ?? null"
        ></app-evm-summary>

        <!-- Sección 3: Tabla de Actividades -->
        <app-activity-table
          *ngIf="selectedProject"
          [activities]="selectedProject.activities || []"
          (newActivity)="showCreateActivityFormModal()"
          (editActivity)="onEditActivity($event)"
          (deleteActivity)="onDeleteActivity($event)"
        ></app-activity-table>

        <!-- Sección 4: Gráfico PV vs EV vs AC -->
        <app-pv-ev-ac-chart
          *ngIf="selectedProject?.activities && selectedProject?.activities?.length ?? 0 > 0"
          [activities]="selectedProject?.activities ?? []"
        ></app-pv-ev-ac-chart>

        <!-- Sección 5: Gauge CPI/SPI -->
        <app-cpi-spi-gauge
          *ngIf="selectedProject?.evmSummary"
          [indicators]="selectedProject?.evmSummary ?? null"
        ></app-cpi-spi-gauge>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }
    .loading-overlay {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
    }
    .dashboard-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      border-radius: 8px;
      padding: 30px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    .modal-close {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }
  `]
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  showCreateProjectForm = false;
  showCreateActivityForm = false;
  editingActivity: Activity | null = null;
  loading = true;
  error = '';

  constructor(
    private projectService: ProjectService,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.loading = true;
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        if (projects.length > 0) {
          this.onSelectProject(projects[0]);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar proyectos: ' + err.message;
        this.loading = false;
      }
    });
  }

  onSelectProject(project: Project): void {
    this.selectedProject = project;
  }

  showCreateProjectFormModal(): void {
    this.showCreateProjectForm = true;
  }

  cancelCreateProject(): void {
    this.showCreateProjectForm = false;
  }

  onProjectCreated(projectData: any): void {
    this.projectService.createProject(projectData).subscribe({
      next: () => {
        this.showCreateProjectForm = false;
        this.loadProjects();
      },
      error: (err) => {
        this.error = 'Error al crear proyecto: ' + err.message;
      }
    });
  }

  onDeleteProject(id: number): void {
    this.projectService.deleteProject(id).subscribe({
      next: () => {
        this.loadProjects();
      },
      error: (err) => {
        this.error = 'Error al eliminar proyecto: ' + err.message;
      }
    });
  }

  showCreateActivityFormModal(): void {
    this.editingActivity = null;
    this.showCreateActivityForm = true;
  }

  cancelCreateActivity(): void {
    this.showCreateActivityForm = false;
    this.editingActivity = null;
  }

  onActivityCreated(activityData: any): void {
    if (!this.selectedProject) return;

    if (this.editingActivity) {
      this.activityService.updateActivity(this.editingActivity.id, activityData).subscribe({
        next: () => {
          this.showCreateActivityForm = false;
          this.editingActivity = null;
          this.projectService.getProjectById(this.selectedProject!.id).subscribe({
            next: (project) => {
              this.selectedProject = project;
            }
          });
        },
        error: (err) => {
          this.error = 'Error al actualizar actividad: ' + err.message;
        }
      });
    } else {
      this.activityService.createActivity(this.selectedProject.id, activityData).subscribe({
        next: () => {
          this.showCreateActivityForm = false;
          this.projectService.getProjectById(this.selectedProject!.id).subscribe({
            next: (project) => {
              this.selectedProject = project;
            }
          });
        },
        error: (err) => {
          this.error = 'Error al crear actividad: ' + err.message;
        }
      });
    }
  }

  onDeleteActivity(id: number): void {
    this.activityService.deleteActivity(id).subscribe({
      next: () => {
        if (this.selectedProject) {
          this.projectService.getProjectById(this.selectedProject.id).subscribe({
            next: (project) => {
              this.selectedProject = project;
            }
          });
        }
      },
      error: (err) => {
        this.error = 'Error al eliminar actividad: ' + err.message;
      }
    });
  }

  onEditActivity(activity: Activity): void {
    this.editingActivity = activity;
    this.showCreateActivityForm = true;
  }
}
