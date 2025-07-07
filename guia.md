# Guia de Endpoints da API de Simulação de Muxes

Este guia detalha os endpoints da API de simulação de muxes, focando nas rotas `/api/v1` e na estrutura dos dados retornados.

## 📋 Estrutura da URL

AOs endpoints `/api/v1` podem ser acessados através da seguinte estrutura, onde `{systemId}` é o identificador do sistema (e.g., `j02`, `j04`) e `{muxType}` indica o tipo de mux (`primary` ou `backup`). Além disso, há rotas de compatibilidade que funcionam sem `{muxType}` e redirecionam para o mux `primary`.

```
http://localhost:3000/{systemId}/{muxType}/api/v1/{endpoint}
http://localhost:3000/{systemId}/api/v1/{endpoint} (Compatibilidade - redireciona para Primary)
```

## 📡 Endpoints de Dados (/api/v1)

### 1. Alarmes Ativos

- **Rota**: `/api/v1/alarms/active`
- **Descrição**: Retorna uma lista de alarmes ativos no sistema/mux.
- **Método HTTP**: `GET`
- **Dados Retornados**: `AlarmActiveItem[]`

```typescript
interface AlarmActiveItem {
  UID: string;
  Type: number;
  Level: 'critical' | 'warning' | 'info';
  StartDate: number;
  Source: string;
  Name: string;
  Description: string;
}
```

### 2. Contagem de Alarmes Ativos

- **Rota**: `/api/v1/alarms/active/count`
- **Descrição**: Retorna a contagem de alarmes ativos no sistema/mux.
- **Método HTTP**: `GET`
- **Dados Retornados**: `number`

### 3. Histórico de Alarmes

- **Rota**: `/api/v1/alarms/history`
- **Descrição**: Retorna o histórico de alarmes do sistema/mux.
- **Método HTTP**: `GET`
- **Dados Retornados**: `AlarmHistoryItem[]`

```typescript
interface AlarmHistoryItem {
  UID: string;
  Type: number;
  Level: 'critical' | 'warning' | 'info';
  StartDate: number;
  ClearDate: number;
  Source: string;
  Name: string;
  Description: string;
}
```

### 4. Lista de ECMGs

- **Rota**: `/api/v1/ecmgs`
- **Descrição**: Retorna uma lista de ECMGs configurados para o sistema/mux.
- **Método HTTP**: `GET`
- **Dados Retornados**: `EcmgItem[]`

```typescript
interface EcmgItem {
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
  CaDescriptors: any[]; // Pode ser mais detalhado se necessário
  ServersList: { Address: string; Port: number }[];
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
```

### 5. Status de ECMG Específico

- **Rota**: `/api/v1/ecmg/status/{ecmgUid}`
- **Descrição**: Retorna o status de um ECMG específico pelo seu UID.
- **Método HTTP**: `GET`
- **Dados Retornados**: `EcmgStatus`

```typescript
interface EcmgStatus {
  ecmguid: number;
  servers: { priority: number; state: number }[];
  activeserverpriority: number;
}
```

### 6. Lista de Outputs

- **Rota**: `/api/v1/outputs`
- **Descrição**: Retorna uma lista de outputs configurados para o sistema/mux.
- **Método HTTP**: `GET`
- **Dados Retornados**: `OutputItem[]`

```typescript
interface OutputItem {
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
    StreamTypesPriority: any[]; // Pode ser mais detalhado se necessário
    PidPriority: any[]; // Pode ser mais detalhado se necessário
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
  AsiOutputs: any[]; // Pode ser mais detalhado se necessário
  BandwidthReservation: {
    NominalBandwidth: number;
    MaximumBandwidth: number;
    Components: any[]; // Pode ser mais detalhado se necessário
  };
  UID: number;
  SITables: any; // Pode ser mais detalhado se necessário
  ExternalPids: any[]; // Pode ser mais detalhado se necessário
}
```

### 7. Estatísticas do Sistema

- **Rota**: `/api/v1/stats`
- **Descrição**: Retorna estatísticas de stream para o sistema/mux.
- **Método HTTP**: `GET`
- **Dados Retornados**: `StatsResponse`

```typescript
interface StatsResponse {
  streamId: number;
  timestampMs: number;
  clockReferenceId: number;
  clockReferenceType: string;
  conformance: string;
  streams: { address: string; port: number; interface: string }[];
  cutoffStatusOutputEnabled: boolean;
  PIDStats: { pid: number; bitrate: number; scramblingstate: number }[];
}
```

### 8. Informações PSI

- **Rota**: `/api/v1/psi`
- **Descrição**: Retorna informações do Program Specific Information (PSI) para o sistema/mux.
- **Método HTTP**: `GET`
- **Dados Retornados**: `PsiResponse`

```typescript
interface PsiResponse {
  transportStreamId: number;
  programs: {
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
    pids: {
      pid: number;
      streamType: number;
      streamTypeDesc: string;
      ecmPid: number[];
    }[];
    pmtpid: number;
    tableType: string;
  }[];
}
```

### 9. Dados de Scrambling

- **Rota**: `/api/v1/scrambling`
- **Descrição**: Retorna dados de scrambling para o sistema/mux.
- **Método HTTP**: `GET`
- **Dados Retornados**: `ScramblingItem[]`

```typescript
interface ScramblingItem {
  Name: string;
  DataID: number;
  DataType: string;
  PrivateData: string;
  MaxBitrate: number;
  Pid: number;
  CaDescriptors: { CasId: string; PrivateData: string; Description: string }[];
  EmmpdgUID: number;
  UID: number;
  TrafficShaping: boolean;
}
``` 