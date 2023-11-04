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
  image?: string;
}

export interface Starter {
  uuid: string;
  name: string;
  flourType: String;
  inFridge: boolean;
  // Currently in server time
  // TODO: Make this UTC
  timeLastFed: number;
  nextFeedingTime?: number;
}

export interface BaseResponse {
  success: boolean;
  errorMessage: string;
}