import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe],
  templateUrl: `./project-list.component.html`,
  styleUrls: [`./project-list.component.css`],
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
