export interface UserDataSummary {
  mean: number;
  mode: number | undefined;
  median: number;
  valid: boolean;
}

export interface UserData {
  name: string;
  points?: string | number;
}
