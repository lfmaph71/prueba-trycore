import { Activity } from './activity.model';
import { EvmIndicators } from './evm-indicators.model';

export interface Project {
  id: number;
  name: string;
  description: string;
  activities?: Activity[];
  evmSummary?: EvmIndicators;
  activityCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectDto {
  name: string;
  description: string;
}

export interface UpdateProjectDto extends CreateProjectDto {}
