import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: `./project-form.html`,
  styleUrls: [`./project-form.css`],
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
