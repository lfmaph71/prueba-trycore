import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Activity } from '../../../core/models/activity.model';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: `./activity-form.component.html`,
  styleUrls: [`./activity-form.component.css`]
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
