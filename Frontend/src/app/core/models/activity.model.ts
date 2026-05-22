import { EvmIndicators } from './evm-indicators.model';

export interface Activity {
  id: number;
  projectId: number;
  name: string;
  bac: number;
  plannedPercent: number;
  actualPercent: number;
  actualCost: number;
  indicators?: EvmIndicators;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateActivityDto {
  name: string;
  bac: number;
  plannedPercent: number;
  actualPercent: number;
  actualCost: number;
}

export interface UpdateActivityDto extends CreateActivityDto {}
