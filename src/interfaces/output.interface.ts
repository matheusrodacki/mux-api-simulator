export interface OutputItem {
  Name: string;
  AutoTransportStreamID: boolean;
  NetworkID: number;
  OriginalNetworkID: number;
  Bitrate: number;
  Conformance: string;
  AutoRemap: boolean;
  NullPacketStripping: boolean;
  PidSharing: boolean;
  IncreasedLatency: number;
  OverflowStrategy: {
    StreamTypesPriority: any[];
    PidPriority: any[];
  };
  ClockReference: {
    Mode: string;
    PidSource: number;
    RestampPcr: boolean;
  };
  Outputs: {
    Address: string;
    Port: number;
    Interface: string;
    RedundancyMode: string;
    BackupInterface: string;
    TOS: number;
    TTL: number;
    NbPackets: number;
    ClearState: boolean;
    Protocol: {
      RTPEnable: boolean;
      RTPConfig: {
        ManualSsrc: boolean;
      };
    };
    Spoofing: {
      IPSpoofingEnable: boolean;
    };
    Enabled: boolean;
    UID: number;
  }[];
  AsiOutputs: any[];
  BandwidthReservation: {
    NominalBandwidth: number;
    MaximumBandwidth: number;
    Components: any[];
  };
  UID: number;
  SITables: any;
  ExternalPids: any[];
}
