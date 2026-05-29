import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EvmApiService } from './evm-api.service';
import { Activity, CreateActivityDto, UpdateActivityDto } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activities$ = new BehaviorSubject<Activity[]>([]);

  constructor(private apiService: EvmApiService) {}

  getActivitiesByProjectId(projectId: number): Observable<Activity[]> {
    let cadena: string = `/projects/${projectId}/activities`;
    return this.apiService.get<Activity[]>(`/projects/${projectId}/activities`).pipe(
      tap(activities => this.activities$.next(activities))
    );
  }

  getActivityById(id: number): Observable<Activity> {
    return this.apiService.get<Activity>(`/activities/${id}`);
  }

  createActivity(projectId: number, activity: CreateActivityDto): Observable<Activity> {
    return this.apiService.post<Activity>(`/projects/${projectId}/activities`, activity).pipe(
      tap(newActivity => {
        const current = this.activities$.value;
        this.activities$.next([...current, newActivity]);
      })
    );
  }

  updateActivity(id: number, activity: UpdateActivityDto): Observable<Activity> {
    return this.apiService.put<Activity>(`/activities/${id}`, activity).pipe(
      tap(updated => {
        const current = this.activities$.value;
        const index = current.findIndex(a => a.id === id);
        if (index > -1) {
          current[index] = updated;
          this.activities$.next([...current]);
        }
      })
    );
  }

  deleteActivity(id: number): Observable<any> {
    return this.apiService.delete(`/activities/${id}`).pipe(
      tap(() => {
        const current = this.activities$.value;
        this.activities$.next(current.filter(a => a.id !== id));
      })
    );
  }

  getActivities(): Observable<Activity[]> {
    return this.activities$.asObservable();
  }
}
