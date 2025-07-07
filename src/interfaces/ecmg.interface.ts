export interface EcmgServer {
  Address: string;
  Port: number;
}

export interface EcmgItem {
  Name: string;
  CASystemID: number;
  CASubsystemID: number;
  ChannelID: number;
  CAAlgorithm: string;
  CAAesScramblingMode: string;
  ScramblingDesc: boolean;
  ChannelTestPeriod: number;
  EcmDelayStartEnable: boolean;
  EcmDelayStart: number;
  EcmTransitionDelayStartEnable: boolean;
  EcmTransitionDelayStart: number;
  CaDescPosition: string;
  ConformedControlWord: boolean;
  ResetControlWordBit54: boolean;
  SendConformedControlWord2Ecmg: boolean;
  PrivateData: string;
  CaDescriptors: any[];
  ServersList: EcmgServer[];
  ForceChannelID: boolean;
  ProtocolVersion: number;
  Mode: string;
  ConnectAllEcmg: boolean;
  AutoSwitch: boolean;
  MediaGuardCaDesc: boolean;
  MediaGuardCasId: number;
  MediaGuardCaDescPosition: string;
  MediaGuardCommonCaDesc: boolean;
  MediaGuardPrivateData: string;
  MediaGuardSubscribingData: string;
  OverrideDefaultDesc: boolean;
  UID: number;
}

export interface EcmgStatus {
  ecmguid: number;
  servers: {
    priority: number;
    state: number;
  }[];
  activeserverpriority: number;
}
