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
  templateUrl: `./dashboard.component.html`,
  styleUrls: [`./dashboard.component.css`]
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


  loading = false;
  error = '';
  debugInfo = '';

  constructor(
    private projectService: ProjectService,
    private activityService: ActivityService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    //this.debugInfo = 'Inicializando...\nAPI URL: ' + environment.apiUrl;
    //this.testConnection();
    this.loadProjects();
  }

  // private testConnection(): void {
  //   // environment.apiUrl
  //   this.http
  //   .get('http://localhost:5013/api/Projects') // Endpoint de prueba para verificar conexión
  //   .subscribe({
  //     next: (data: any) => {
  //       this.debugInfo += '\n✅ Conexión exitosa a la API';
  //       this.debugInfo += '\nDatos recibidos: ' + JSON.stringify(data).substring(0, 300) + '...';
  //       this.projects = data;
  //       if (data.length > 0) {
  //         this.onSelectProject(data[0]);
  //       }
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.debugInfo += '\n❌ Error de conexión: ' + JSON.stringify(err);
  //       this.error = 'Error al cargar proyectos. Ver consola (F12) para detalles.';
  //       this.loading = false;
  //     }
  //   });
  // }

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