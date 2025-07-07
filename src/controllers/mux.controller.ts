import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DataService } from '../services/data.service';

@Controller()
export class MuxController {
  constructor(private readonly dataService: DataService) {}

  // Middleware para validar sistema
  private validateSystem(systemId: string) {
    const normalizedSystemId = systemId.toUpperCase();

    if (!this.dataService.isValidSystem(normalizedSystemId)) {
      const validSystems = this.dataService.getValidSystems();
      throw new HttpException(
        `Sistema não encontrado. Sistemas válidos: ${validSystems.join(', ')}`,
        HttpStatus.NOT_FOUND
      );
    }

    return normalizedSystemId;
  }

  // Middleware para validar mux
  private validateMux(systemId: string, muxType: string) {
    const normalizedSystemId = this.validateSystem(systemId);
    const normalizedMuxType = muxType.toLowerCase();

    if (!this.dataService.isValidMux(normalizedSystemId, normalizedMuxType)) {
      throw new HttpException(
        `Mux tipo '${muxType}' não encontrado. Tipos válidos: primary, backup`,
        HttpStatus.NOT_FOUND
      );
    }

    return { systemId: normalizedSystemId, muxType: normalizedMuxType };
  }

  // Simula timeout ocasional para teste
  private async simulateTimeout() {
    if (Math.random() < 0.05) {
      // 5% de chance de timeout
      await new Promise((resolve) => setTimeout(resolve, 35000)); // 35 segundos
    }
  }

  // Lista todos os sistemas disponíveis
  @Get('systems')
  async getSystems() {
    const systems = this.dataService.getValidSystems();
    return {
      systems,
      total: systems.length,
      description: 'Sistemas J02, J04, J06, J08 com mux principal e backup',
      muxTypes: ['primary', 'backup'],
    };
  }

  // Lista muxes de um sistema específico
  @Get(':systemId/muxes')
  async getSystemMuxes(@Param('systemId') systemId: string) {
    const system = this.validateSystem(systemId);
    return {
      system,
      muxes: {
        primary: {
          name: `${system}-PRIMARY`,
          status: 'online',
          type: 'primary',
          endpoint: `/${system.toLowerCase()}/primary`,
        },
        backup: {
          name: `${system}-BACKUP`,
          status: 'online',
          type: 'backup',
          endpoint: `/${system.toLowerCase()}/backup`,
        },
      },
    };
  }

  // Rota agregada para compatibilidade com CA-Monitor
  @Get(':systemId')
  async getAggregatedData(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();

    const psiData = this.dataService.getPsi(system, muxType);
    const statsData = this.dataService.getStats(system);

    return {
      psiData,
      statsData,
    };
  }

  // ROTAS PARA MUX PRINCIPAL

  // Alarmes ativos - MUX PRIMARY
  @Get(':systemId/primary/api/v1/alarms/active')
  async getActiveAlarmsPrimary(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getActiveAlarms(system, muxType);
  }

  // Contagem de alarmes ativos - MUX PRIMARY
  @Get(':systemId/primary/api/v1/alarms/active/count')
  async getActiveAlarmsCountPrimary(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getActiveAlarmsCount(system, muxType);
  }

  // Histórico de alarmes - MUX PRIMARY
  @Get(':systemId/primary/api/v1/alarms/history')
  async getAlarmHistoryPrimary(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getAlarmHistory(system);
  }

  // Lista de ECMGs - MUX PRIMARY
  @Get(':systemId/primary/api/v1/ecmgs')
  async getEcmgsPrimary(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getEcmgs(system);
  }

  // Status de ECMG específico - MUX PRIMARY
  @Get(':systemId/primary/api/v1/ecmg/status/:ecmgUid')
  async getEcmgStatusPrimary(
    @Param('systemId') systemId: string,
    @Param('ecmgUid', ParseIntPipe) ecmgUid: number
  ) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getEcmgStatus(system, ecmgUid);
  }

  // Lista de outputs - MUX PRIMARY
  @Get(':systemId/primary/api/v1/outputs')
  async getOutputsPrimary(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getOutputs(system, muxType);
  }

  // Estatísticas - MUX PRIMARY
  @Get(':systemId/primary/api/v1/stats')
  async getStatsPrimary(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getStats(system);
  }

  // Dados PSI - MUX PRIMARY
  @Get(':systemId/primary/api/v1/mux/outputs/:outputId/psi')
  async getPsiPrimary(
    @Param('systemId') systemId: string,
    @Param('outputId', ParseIntPipe) outputId: number,
  ) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getPsi(system, muxType);
  }

  // Dados de scrambling - MUX PRIMARY
  @Get(':systemId/primary/api/v1/scrambling')
  async getScramblingPrimary(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getScrambling(system, muxType);
  }

  // Health check - MUX PRIMARY
  @Get(':systemId/primary/health')
  async healthCheckPrimary(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'primary');
    return {
      system,
      muxType,
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }

  // Status geral - MUX PRIMARY
  @Get(':systemId/primary/status')
  async getSystemStatusPrimary(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'primary');
    return {
      system,
      muxType,
      online: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  // ROTAS PARA MUX BACKUP

  // Alarmes ativos - MUX BACKUP
  @Get(':systemId/backup/api/v1/alarms/active')
  async getActiveAlarmsBackup(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'backup');
    await this.simulateTimeout();
    return this.dataService.getActiveAlarms(system, muxType);
  }

  // Contagem de alarmes ativos - MUX BACKUP
  @Get(':systemId/backup/api/v1/alarms/active/count')
  async getActiveAlarmsCountBackup(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'backup');
    await this.simulateTimeout();
    return this.dataService.getActiveAlarmsCount(system, muxType);
  }

  // Histórico de alarmes - MUX BACKUP
  @Get(':systemId/backup/api/v1/alarms/history')
  async getAlarmHistoryBackup(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'backup');
    await this.simulateTimeout();
    return this.dataService.getAlarmHistory(system);
  }

  // Lista de ECMGs - MUX BACKUP
  @Get(':systemId/backup/api/v1/ecmgs')
  async getEcmgsBackup(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'backup');
    await this.simulateTimeout();
    return this.dataService.getEcmgs(system);
  }

  // Status de ECMG específico - MUX BACKUP
  @Get(':systemId/backup/api/v1/ecmg/status/:ecmgUid')
  async getEcmgStatusBackup(
    @Param('systemId') systemId: string,
    @Param('ecmgUid', ParseIntPipe) ecmgUid: number
  ) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'backup');
    await this.simulateTimeout();
    return this.dataService.getEcmgStatus(system, ecmgUid);
  }

  // Lista de outputs - MUX BACKUP
  @Get(':systemId/backup/api/v1/outputs')
  async getOutputsBackup(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'backup');
    await this.simulateTimeout();
    return this.dataService.getOutputs(system, muxType);
  }

  // Estatísticas - MUX BACKUP
  @Get(':systemId/backup/api/v1/stats')
  async getStatsBackup(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'backup');
    await this.simulateTimeout();
    return this.dataService.getStats(system);
  }

  // Dados PSI - MUX BACKUP
  @Get(':systemId/backup/api/v1/mux/outputs/:outputId/psi')
  async getPsiBackup(
    @Param('systemId') systemId: string,
    @Param('outputId', ParseIntPipe) outputId: number,
  ) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'backup');
    await this.simulateTimeout();
    return this.dataService.getPsi(system, muxType);
  }

  // Dados de scrambling - MUX BACKUP
  @Get(':systemId/backup/api/v1/scrambling')
  async getScramblingBackup(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'backup');
    await this.simulateTimeout();
    return this.dataService.getScrambling(system, muxType);
  }

  // Health check - MUX BACKUP
  @Get(':systemId/backup/health')
  async healthCheckBackup(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'backup');
    return {
      system,
      muxType,
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }

  // Status geral - MUX BACKUP
  @Get(':systemId/backup/status')
  async getSystemStatusBackup(@Param('systemId') systemId: string) {
    const { systemId: system, muxType } = this.validateMux(systemId, 'backup');
    return {
      system,
      muxType,
      online: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  // ROTAS ANTIGAS (MANTIDAS PARA COMPATIBILIDADE) - redirecionam para PRIMARY

  // Alarmes ativos - compatibilidade
  @Get(':systemId/api/v1/alarms/active')
  async getActiveAlarms(@Param('systemId') systemId: string) {
    const { systemId: system } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getActiveAlarms(system, 'primary');
  }

  // Contagem de alarmes ativos - compatibilidade
  @Get(':systemId/api/v1/alarms/active/count')
  async getActiveAlarmsCount(@Param('systemId') systemId: string) {
    const { systemId: system } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getActiveAlarmsCount(system, 'primary');
  }

  // Histórico de alarmes - compatibilidade
  @Get(':systemId/api/v1/alarms/history')
  async getAlarmHistory(@Param('systemId') systemId: string) {
    const { systemId: system } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getAlarmHistory(system);
  }

  // Lista de ECMGs - compatibilidade
  @Get(':systemId/api/v1/ecmgs')
  async getEcmgs(@Param('systemId') systemId: string) {
    const { systemId: system } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getEcmgs(system);
  }

  // Status de ECMG específico - compatibilidade
  @Get(':systemId/api/v1/ecmg/status/:ecmgUid')
  async getEcmgStatus(
    @Param('systemId') systemId: string,
    @Param('ecmgUid', ParseIntPipe) ecmgUid: number
  ) {
    const { systemId: system } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getEcmgStatus(system, ecmgUid);
  }

  // Lista de outputs - compatibilidade
  @Get(':systemId/api/v1/outputs')
  async getOutputs(@Param('systemId') systemId: string) {
    const { systemId: system } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getOutputs(system, 'primary');
  }

  // Estatísticas - compatibilidade
  @Get(':systemId/api/v1/stats')
  async getStats(@Param('systemId') systemId: string) {
    const { systemId: system } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getStats(system);
  }

  // Dados PSI - compatibilidade
  @Get(':systemId/api/v1/mux/outputs/:outputId/psi')
  async getPsi(
    @Param('systemId') systemId: string,
    @Param('outputId', ParseIntPipe) outputId: number,
  ) {
    const { systemId: system } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getPsi(system, 'primary');
  }

  // Dados de scrambling - compatibilidade
  @Get(':systemId/api/v1/scrambling')
  async getScrambling(@Param('systemId') systemId: string) {
    const { systemId: system } = this.validateMux(systemId, 'primary');
    await this.simulateTimeout();
    return this.dataService.getScrambling(system, 'primary');
  }

  // Health check - compatibilidade
  @Get(':systemId/health')
  async healthCheck(@Param('systemId') systemId: string) {
    const { systemId: system } = this.validateMux(systemId, 'primary');
    return {
      system,
      muxType: 'primary',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      note: 'Endpoint de compatibilidade - redirecionando para PRIMARY',
    };
  }

  // Status geral - compatibilidade
  @Get(':systemId/status')
  async getSystemStatus(@Param('systemId') systemId: string) {
    const { systemId: system } = this.validateMux(systemId, 'primary');
    return {
      system,
      muxType: 'primary',
      online: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      note: 'Endpoint de compatibilidade - redirecionando para PRIMARY',
    };
  }
}
