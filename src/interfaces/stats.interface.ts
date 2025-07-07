export interface PidStat {
  pid: number;
  bitrate: number;
  scramblingstate: number;
}

export interface StreamInfo {
  address: string;
  port: number;
  interface: string;
}

export interface StatsResponse {
  streamId: number;
  timestampMs: number;
  clockReferenceId: number;
  clockReferenceType: string;
  conformance: string;
  streams: StreamInfo[];
  cutoffStatusOutputEnabled: boolean;
  PIDStats: PidStat[];
}
