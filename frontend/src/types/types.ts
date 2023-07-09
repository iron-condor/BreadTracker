export interface Timer {
  label: string;
  lowerLimit: number;
  upperLimit: number;
  overnight: boolean;
  finishedAt?: number;
  active?: boolean;
}

export interface Recipe {
  uuid: string;
  name: string;
  description: string;
  timers: Timer[];
}

export interface BaseResponse {
  success: boolean;
  errorMessage: string;
}