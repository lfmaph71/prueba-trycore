import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
import { environment } from '../../../environments/environment';

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

      <!-- Debug info -->
      <div *ngIf="debugInfo" style="background:#f0f0f0;padding:10px;margin-bottom:10px;border-radius:4px;font-size:12px;font-family:monospace;white-space:pre-wrap;">
        {{ debugInfo }}
      </div>

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
        <app-project-list
          [projects]="projects"
          (newProject)="showCreateProjectFormModal()"
          (selectProject)="onSelectProject($event)"
          (openActivities)="openProjectActivities($event)"
          (deleteProject)="onDeleteProject($event)"
        ></app-project-list>

        <div *ngIf="selectedProject" class="project-insight-card">
          <div>
            <p class="eyebrow">Proyecto activo</p>
            <h1 class="project-title">{{ selectedProject.name }}</h1>
            <p class="project-description">{{ selectedProject.description || 'Sin descripción' }}</p>
          </div>
          <div class="project-status-pill" [ngClass]="getProjectStatusClass()">
            {{ getProjectStatusLabel() }}
          </div>
        </div>

        <app-evm-summary
          *ngIf="selectedProject?.evmSummary != null"
          [indicators]="selectedProject?.evmSummary ?? null"
        ></app-evm-summary>

        <div *ngIf="selectedProject && !showActivitiesPanel" class="analysis-hint-card">
          <h2>Gestión de actividades</h2>
          <p>Haz clic en <strong>Actividades</strong> del proyecto para ver y editar sus actividades, y analizar el desempeño en tiempo real.</p>
        </div>

        <app-activity-table
          *ngIf="selectedProject && showActivitiesPanel"
          [activities]="activities"
          (newActivity)="showCreateActivityFormModal()"
          (editActivity)="onEditActivity($event)"
          (deleteActivity)="onDeleteActivity($event)"
        ></app-activity-table>

        <app-pv-ev-ac-chart
          *ngIf="activities.length > 0"
          [activities]="activities"
        ></app-pv-ev-ac-chart>

        <app-cpi-spi-gauge
          *ngIf="selectedProject?.evmSummary != null"
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
    .project-insight-card {
      background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
      border-radius: 16px;
      padding: 24px;
      color: white;
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: center;
      box-shadow: 0 18px 40px rgba(29, 78, 216, 0.18);
    }
    .eyebrow {
      margin: 0 0 6px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 12px;
      opacity: 0.8;
    }
    .project-title {
      margin: 0;
      font-size: 28px;
    }
    .project-description {
      margin: 10px 0 0;
      color: rgba(255, 255, 255, 0.9);
    }
    .project-status-pill {
      padding: 10px 14px;
      border-radius: 999px;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 12px;
      white-space: nowrap;
    }
    .status-good {
      background: rgba(34, 197, 94, 0.2);
      color: #dcfce7;
    }
    .status-warning {
      background: rgba(245, 158, 11, 0.2);
      color: #fef3c7;
    }
    .status-danger {
      background: rgba(239, 68, 68, 0.2);
      color: #fee2e2;
    }
    .analysis-hint-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
    }
    .analysis-hint-card h2 {
      margin-top: 0;
      margin-bottom: 8px;
      color: #0f172a;
    }
    .analysis-hint-card p {
      margin: 0;
      color: #475569;
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
  activities: Activity[] = [];
  showCreateProjectForm = false;
  showCreateActivityForm = false;
  showActivitiesPanel = false;
  editingActivity: Activity | null = null;
  
    openProjectActivities(project: Project): void {
      this.selectedProject = project;
      this.showCreateActivityForm = false;
      this.editingActivity = null;
      this.showActivitiesPanel = true;
      this.loadActivities(project.id);
    }


  loading = true;
  error = '';
  debugInfo = '';

  constructor(
    private projectService: ProjectService,
    private activityService: ActivityService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.debugInfo = 'Inicializando...\nAPI URL: ' + environment.apiUrl;
    this.testConnection();
  }

  private testConnection(): void {
    this.http.get(environment.apiUrl + '/projects').subscribe({
      next: (data: any) => {
        this.debugInfo += '\n✅ Conexión exitosa a la API';
        this.debugInfo += '\nDatos recibidos: ' + JSON.stringify(data).substring(0, 300) + '...';
        this.projects = data;
        if (data.length > 0) {
          this.onSelectProject(data[0]);
        }
        this.loading = false;
      },
      error: (err) => {
        this.debugInfo += '\n❌ Error de conexión: ' + JSON.stringify(err);
        this.error = 'Error al cargar proyectos. Ver consola (F12) para detalles.';
        this.loading = false;
      }
    });
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
    this.showCreateActivityForm = false;
    this.editingActivity = null;
    this.showActivitiesPanel = false;
    this.loadActivities(project.id);
  }

  //openProjectActivities(project: Project): void {
  //  this.onSelectProject(project);
  //  this.showActivitiesPanel = true;
  //}

  private loadActivities(projectId: number): void {
    this.activityService.getActivitiesByProjectId(projectId).subscribe({
      next: (activities) => {
        this.activities = activities;
      },
      error: (err) => {
        this.error = 'Error al cargar actividades: ' + err.message;
      }
    });
  }

  getProjectStatusLabel(): string {
    const cpi = this.selectedProject?.evmSummary?.costPerformanceIndex ?? 1;
    const spi = this.selectedProject?.evmSummary?.schedulePerformanceIndex ?? 1;

    if (cpi >= 1 && spi >= 1) {
      return 'Proyecto en buen estado';
    }

    if (cpi >= 0.9 || spi >= 0.9) {
      return 'Atención moderada';
    }

    return 'Proyecto en riesgo';
  }

  getProjectStatusClass(): string {
    const cpi = this.selectedProject?.evmSummary?.costPerformanceIndex ?? 1;
    const spi = this.selectedProject?.evmSummary?.schedulePerformanceIndex ?? 1;

    if (cpi >= 1 && spi >= 1) {
      return 'status-good';
    }

    if (cpi >= 0.9 || spi >= 0.9) {
      return 'status-warning';
    }

    return 'status-danger';
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
          this.loadActivities(this.selectedProject!.id);
        },
        error: (err) => {
          this.error = 'Error al actualizar actividad: ' + err.message;
        }
      });
    } else {
      this.activityService.createActivity(this.selectedProject.id, activityData).subscribe({
        next: () => {
          this.showCreateActivityForm = false;
          this.loadActivities(this.selectedProject!.id);
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
          this.loadActivities(this.selectedProject.id);
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