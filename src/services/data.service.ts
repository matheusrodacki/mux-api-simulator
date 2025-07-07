import { Injectable } from '@nestjs/common';
import {
  AlarmHistoryItem,
  AlarmActiveItem,
  EcmgItem,
  EcmgStatus,
  OutputItem,
  StatsResponse,
  PsiResponse,
  ScramblingItem,
} from '../interfaces';

@Injectable()
export class DataService {
  private systemData: Record<string, any> = {};

  constructor() {
    // Gera sistemas J02, J04, J06, J08, J10, J12, J14, J16, J18, J20 com mux principal e backup
    const systems = [
      'J02',
      'J04',
      'J06',
      'J08',
      'J10',
      'J12',
      'J14',
      'J16',
      'J18',
      'J20',
    ];

    systems.forEach((systemId) => {
      this.systemData[systemId] = {
        name: systemId,
        systemId: systemId,
        status: 'online',
        muxes: {
          primary: {
            name: `${systemId}-PRIMARY`,
            status: 'online',
            type: 'primary',
          },
          backup: {
            name: `${systemId}-BACKUP`,
            status: 'online',
            type: 'backup',
          },
        },
      };
    });
  }

  // Retorna lista de sistemas válidos
  getValidSystems(): string[] {
    return Object.keys(this.systemData);
  }

  // Verifica se sistema é válido
  isValidSystem(systemId: string): boolean {
    return this.systemData.hasOwnProperty(systemId.toUpperCase());
  }

  // Verifica se mux é válido
  isValidMux(systemId: string, muxType: string): boolean {
    const system = this.systemData[systemId.toUpperCase()];
    if (!system) return false;
    return muxType === 'primary' || muxType === 'backup';
  }

  // Obtém informações do mux
  getMuxInfo(systemId: string, muxType: string) {
    const system = this.systemData[systemId.toUpperCase()];
    if (!system) return null;
    return system.muxes[muxType];
  }

  // Simula instabilidade ocasional para fins de teste
  private getRandomStatus(): 'online' | 'offline' {
    return Math.random() > 0.1 ? 'online' : 'offline';
  }

  // Gera dados de alarmes ativos
  getActiveAlarms(systemId: string, muxType?: string): AlarmActiveItem[] {
    const isOffline = this.getRandomStatus() === 'offline';
    const muxSuffix = muxType ? `-${muxType.toUpperCase()}` : '';

    if (isOffline) {
      return [
        {
          UID: `alarm-${systemId}${muxSuffix}-${Date.now()}`,
          Type: 43,
          Level: 'critical',
          StartDate: Date.now() * 1000000,
          Source: 'Scg',
          Name: `EIS communication error${muxSuffix}`,
          Description: `No EIS activity on ${systemId}${muxSuffix}.`,
        },
      ];
    }

    return [];
  }

  // Conta alarmes ativos
  getActiveAlarmsCount(systemId: string, muxType?: string): number {
    return this.getActiveAlarms(systemId, muxType).length;
  }

  // Gera histórico de alarmes
  getAlarmHistory(systemId: string): AlarmHistoryItem[] {
    const history: AlarmHistoryItem[] = [];

    // Gera histórico dos últimos 10 dias
    for (let i = 0; i < 20; i++) {
      const startDate = Date.now() - i * 24 * 60 * 60 * 1000;
      const clearDate = startDate + Math.random() * 60 * 60 * 1000;

      history.push({
        UID: `hist-${systemId}-${startDate}`,
        Type: 43,
        Level: Math.random() > 0.7 ? 'critical' : 'warning',
        StartDate: startDate * 1000000,
        ClearDate: clearDate * 1000000,
        Source: 'Scg',
        Name: 'EIS communication error',
        Description: 'No EIS activity.',
      });
    }

    return history;
  }

  // Gera lista de ECMGs
  getEcmgs(systemId: string): EcmgItem[] {
    console.log('Enviando ECMGs para o sistema: ', systemId);

    return [
      {
        Name: `ECMG SKY ${systemId}`,
        CASystemID: 2374,
        CASubsystemID: 1,
        ChannelID: 7,
        CAAlgorithm: 'DVB CSA',
        CAAesScramblingMode: 'CBC',
        ScramblingDesc: true,
        ChannelTestPeriod: 0,
        EcmDelayStartEnable: false,
        EcmDelayStart: -1000,
        EcmTransitionDelayStartEnable: false,
        EcmTransitionDelayStart: -1000,
        CaDescPosition: 'default',
        ConformedControlWord: true,
        ResetControlWordBit54: true,
        SendConformedControlWord2Ecmg: false,
        PrivateData: '',
        CaDescriptors: [],
        ServersList: [{ Address: '10.218.222.152', Port: 11113 }],
        ForceChannelID: true,
        ProtocolVersion: 2,
        Mode: 'Parameter',
        ConnectAllEcmg: true,
        AutoSwitch: true,
        MediaGuardCaDesc: false,
        MediaGuardCasId: 256,
        MediaGuardCaDescPosition: 'default',
        MediaGuardCommonCaDesc: false,
        MediaGuardPrivateData: '',
        MediaGuardSubscribingData: 'FF3FFFFFFFFFFFFFFF0021',
        OverrideDefaultDesc: true,
        UID: 4,
      },
      {
        Name: `ECMG SKY - NAGRA ${systemId}`,
        CASystemID: 6187,
        CASubsystemID: 0,
        ChannelID: 7,
        CAAlgorithm: 'DVB CSA',
        CAAesScramblingMode: 'ECB',
        ScramblingDesc: true,
        ChannelTestPeriod: 0,
        EcmDelayStartEnable: false,
        EcmDelayStart: -1000,
        EcmTransitionDelayStartEnable: false,
        EcmTransitionDelayStart: -1000,
        CaDescPosition: 'default',
        ConformedControlWord: true,
        ResetControlWordBit54: true,
        SendConformedControlWord2Ecmg: true,
        PrivateData: '',
        CaDescriptors: [],
        ServersList: [
          { Address: '10.218.213.136', Port: 3335 },
          { Address: '10.218.213.137', Port: 3335 },
        ],
        ForceChannelID: true,
        ProtocolVersion: 2,
        Mode: 'Parameter',
        ConnectAllEcmg: false,
        AutoSwitch: true,
        MediaGuardCaDesc: false,
        MediaGuardCasId: 256,
        MediaGuardCaDescPosition: 'default',
        MediaGuardCommonCaDesc: false,
        MediaGuardPrivateData: '',
        MediaGuardSubscribingData: 'FF3FFFFFFFFFFFFFFF0021',
        OverrideDefaultDesc: true,
        UID: 56274,
      },
    ];
  }

  // Gera status de ECMG
  getEcmgStatus(systemId: string, ecmgUid: number): EcmgStatus {
    console.log('Enviando status de ECMG para o sistema: ', systemId);
    const isOnline = this.getRandomStatus() === 'online';

    return {
      ecmguid: ecmgUid,
      servers: [
        { priority: 0, state: isOnline ? 3 : 0 },
        { priority: 1, state: 0 },
      ],
      activeserverpriority: isOnline ? 0 : -1,
    };
  }

  // Gera lista de outputs
  getOutputs(systemId: string, muxType?: string): OutputItem[] {
    const muxSuffix = muxType ? `-${muxType.toUpperCase()}` : '';
    return [
      {
        Name: `${systemId}${muxSuffix}-OUT`,
        AutoTransportStreamID: false,
        NetworkID: 162,
        OriginalNetworkID: 162,
        Bitrate: 38720000,
        Conformance: 'DVB',
        AutoRemap: false,
        NullPacketStripping: false,
        PidSharing: true,
        IncreasedLatency: 0,
        OverflowStrategy: {
          StreamTypesPriority: [],
          PidPriority: [],
        },
        ClockReference: {
          Mode: 'Auto Pcr',
          PidSource: 0,
          RestampPcr: false,
        },
        Outputs: [
          {
            Address: '232.20.29.163',
            Port: 52963,
            Interface: 'enp3s0f0',
            RedundancyMode: 'None',
            BackupInterface: 'None',
            TOS: 0,
            TTL: 7,
            NbPackets: 7,
            ClearState: false,
            Protocol: {
              RTPEnable: true,
              RTPConfig: {
                ManualSsrc: false,
              },
            },
            Spoofing: {
              IPSpoofingEnable: false,
            },
            Enabled: true,
            UID: 1,
          },
        ],
        AsiOutputs: [],
        BandwidthReservation: {
          NominalBandwidth: 0,
          MaximumBandwidth: 0,
          Components: [],
        },
        UID: 3,
        SITables: {},
        ExternalPids: [],
      },
    ];
  }

  // Gera estatísticas
  getStats(systemId: string): StatsResponse {
    const baseTime = Date.now() * 1000000;

    return {
      streamId: 3,
      timestampMs: baseTime,
      clockReferenceId: 4432,
      clockReferenceType: 'Pcr',
      conformance: 'DVB',
      streams: [
        {
          address: '232.20.29.163',
          port: 52963,
          interface: 'enp3s0f0',
        },
      ],
      cutoffStatusOutputEnabled: true,
      PIDStats: [
        { pid: 0, bitrate: 7511, scramblingstate: 0 },
        { pid: 1, bitrate: 3004, scramblingstate: 0 },
        { pid: 16, bitrate: 28542, scramblingstate: 0 },
        { pid: 17, bitrate: 392084, scramblingstate: 0 },
        { pid: 18, bitrate: 560335, scramblingstate: 0 },
        { pid: 4352, bitrate: 2317957, scramblingstate: 2 },
        { pid: 4355, bitrate: 199798, scramblingstate: 2 },
        { pid: 4356, bitrate: 196793, scramblingstate: 2 },
        { pid: 8191, bitrate: 7407549, scramblingstate: 0 },
      ],
    };
  }

  // Gera dados PSI
  getPsi(systemId: string, muxType?: string): PsiResponse {
    const muxSuffix = muxType ? ` ${muxType.toUpperCase()}` : '';
    return {
      transportStreamId: 24745,
      programs: [
        {
          programId: 5301,
          pmtPid: 40,
          serviceName: `CANAL ${systemId}${muxSuffix} HD`,
          serviceProvider: '',
          type: 25,
          scrambled: true,
          eitSchedFlag: true,
          eitPfFlag: true,
          streamId: 3,
          pcrPid: 4352,
          pids: [
            {
              pid: 4352,
              streamType: 27,
              streamTypeDesc: 'video',
              ecmPid: [1736, 2541, 3488, 7520],
            },
            {
              pid: 4355,
              streamType: 4,
              streamTypeDesc: 'audio',
              ecmPid: [1736, 2541, 3488, 7520],
            },
          ],
          pmtpid: 40,
          tableType: 'PMT',
        },
      ],
    };
  }

  // Gera dados de scrambling
  getScrambling(systemId: string, muxType?: string): ScramblingItem[] {
    const muxSuffix = muxType ? ` ${muxType.toUpperCase()}` : '';
    return [
      {
        Name: `EMM PID ${systemId}${muxSuffix}`,
        DataID: 2,
        DataType: 'Entitlement Management Message',
        PrivateData: '',
        MaxBitrate: 700000,
        Pid: 192,
        CaDescriptors: [
          { CasId: '0942', PrivateData: '00C0', Description: '' },
        ],
        EmmpdgUID: 5,
        UID: 6,
        TrafficShaping: false,
      },
      {
        Name: `EMM Nagra ${systemId}${muxSuffix}`,
        DataID: 1,
        DataType: 'Entitlement Management Message',
        PrivateData: '',
        MaxBitrate: 700000,
        Pid: 1025,
        CaDescriptors: [
          {
            CasId: '182b',
            PrivateData: '0401',
            Description: `EMM Nagra ${systemId}${muxSuffix}`,
          },
        ],
        EmmpdgUID: 60123,
        UID: 60124,
        TrafficShaping: false,
      },
    ];
  }
}
