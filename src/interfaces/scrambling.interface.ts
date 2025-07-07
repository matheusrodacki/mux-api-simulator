export interface CaDescriptor {
  CasId: string;
  PrivateData: string;
  Description: string;
}

export interface ScramblingItem {
  Name: string;
  DataID: number;
  DataType: string;
  PrivateData: string;
  MaxBitrate: number;
  Pid: number;
  CaDescriptors: CaDescriptor[];
  EmmpdgUID: number;
  UID: number;
  TrafficShaping: boolean;
}
