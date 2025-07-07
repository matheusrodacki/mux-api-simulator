export interface PsiPid {
  pid: number;
  streamType: number;
  streamTypeDesc: string;
  ecmPid: number[];
}

export interface PsiProgram {
  programId: number;
  pmtPid: number;
  serviceName: string;
  serviceProvider: string;
  type: number;
  scrambled: boolean;
  eitSchedFlag: boolean;
  eitPfFlag: boolean;
  streamId: number;
  pcrPid: number;
  pids: PsiPid[];
  pmtpid: number;
  tableType: string;
}

export interface PsiResponse {
  transportStreamId: number;
  programs: PsiProgram[];
}
