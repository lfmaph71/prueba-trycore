import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { EvmApiService } from './evm-api.service';
import { Project, CreateProjectDto, UpdateProjectDto } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects$ = new BehaviorSubject<Project[]>([]);
  private selectedProject$ = new BehaviorSubject<Project | null>(null);

  constructor(private apiService: EvmApiService) {}

  getAllProjects(): Observable<Project[]> {
    return this.apiService.get<Project[]>('/projects').pipe(
      tap(projects => this.projects$.next(projects))
    );
  }

  getProjectById(id: number): Observable<Project> {
    return this.apiService.get<Project>(`/projects/${id}`).pipe(
      tap(project => this.selectedProject$.next(project))
    );
  }

  createProject(project: CreateProjectDto): Observable<Project> {
    return this.apiService.post<Project>('/projects', project).pipe(
      tap(newProject => {
        const current = this.projects$.value;
        this.projects$.next([...current, newProject]);
      })
    );
  }

  updateProject(id: number, project: UpdateProjectDto): Observable<Project> {
    return this.apiService.put<Project>(`/projects/${id}`, project).pipe(
      tap(updated => {
        const current = this.projects$.value;
        const index = current.findIndex(p => p.id === id);
        if (index > -1) {
          current[index] = updated;
          this.projects$.next([...current]);
        }
        this.selectedProject$.next(updated);
      })
    );
  }

  deleteProject(id: number): Observable<any> {
    return this.apiService.delete(`/projects/${id}`).pipe(
      tap(() => {
        const current = this.projects$.value;
        this.projects$.next(current.filter(p => p.id !== id));
        this.selectedProject$.next(null);
      })
    );
  }

  getProjects(): Observable<Project[]> {
    return this.projects$.asObservable();
  }

  getSelectedProject(): Observable<Project | null> {
    return this.selectedProject$.asObservable();
  }

  setSelectedProject(project: Project): void {
    this.selectedProject$.next(project);
  }
}
