export interface AlarmHistoryItem {
  UID: string;
  Type: number;
  Level: 'critical' | 'warning' | 'info';
  StartDate: number;
  ClearDate?: number;
  Source: string;
  Name: string;
  Description: string;
}

export interface AlarmActiveItem {
  UID: string;
  Type: number;
  Level: 'critical' | 'warning' | 'info';
  StartDate: number;
  Source: string;
  Name: string;
  Description: string;
}
