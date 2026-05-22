import { CpiInterpretation, SpiInterpretation } from './enums';

export interface EvmIndicators {
  plannedValue: number;
  earnedValue: number;
  actualCost: number;
  costVariance: number;
  scheduleVariance: number;
  costPerformanceIndex: number;
  schedulePerformanceIndex: number;
  estimateAtCompletion: number;
  varianceAtCompletion: number;
  cpiInterpretation: CpiInterpretation;
  spiInterpretation: SpiInterpretation;
}
