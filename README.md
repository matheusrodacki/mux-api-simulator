# Simulador de API dos Muxes

Este projeto é um simulador NestJS que emula a API dos sistemas de muxes J02, J04, J06, J08, J10, J12, J14, J16, J18 e J20, cada um com um mux principal e um de backup, baseado nos exemplos reais do projeto titan-muxe-vision.

## 📋 Funcionalidades

- **Sistemas Suportados**: J02 ao J20 (apenas pares) - Total: 10 sistemas (cada um com mux principal e backup)
- **Endpoints Completos**: Alarmes, ECMGs, Outputs, Stats, PSI, Scrambling (para cada mux)
- **Simulação Realista**: Dados baseados em exemplos reais
- **Timeouts Ocasionais**: Simula instabilidade de rede (5% de chance)
- **Status Variável**: Simula sistemas online/offline para teste
- **Validação Dinâmica**: Sistema automaticamente valida sistemas e tipos de mux disponíveis

## 🚀 Instalação e Execução

### Instalação das dependências
```bash
npm install
```

### Execução em modo desenvolvimento
```bash
npm run start:dev
```

### Build e execução em produção
```bash
npm run build
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📡 Endpoints Disponíveis

### Estrutura das URLs
```
http://localhost:3000/{systemId}/{muxType}/api/v1/{endpoint}
http://localhost:3000/{systemId}/api/v1/{endpoint} (Compatibilidade - redireciona para Primary)
```

Onde:
- `{systemId}` pode ser: `j02`, `j04`, `j06`, `j08`, `j10`, `j12`, `j14`, `j16`, `j18`, `j20`
- `{muxType}` pode ser: `primary` ou `backup`

### Endpoints Específicos do MUX

- `GET /systems` - Lista todos os sistemas e tipos de mux disponíveis
- `GET /{systemId}/muxes` - Lista informações dos muxes (primary/backup) para um sistema

### Alarmes
- `GET /{systemId}/primary/api/v1/alarms/active` - Lista alarmes ativos do mux principal
- `GET /{systemId}/backup/api/v1/alarms/active` - Lista alarmes ativos do mux de backup
- `GET /{systemId}/primary/api/v1/alarms/active/count` - Conta alarmes ativos do mux principal
- `GET /{systemId}/backup/api/v1/alarms/active/count` - Conta alarmes ativos do mux de backup
- `GET /{systemId}/primary/api/v1/alarms/history` - Histórico de alarmes do mux principal
- `GET /{systemId}/backup/api/v1/alarms/history` - Histórico de alarmes do mux de backup

### ECMGs
- `GET /{systemId}/primary/api/v1/ecmgs` - Lista ECMGs configurados do mux principal
- `GET /{systemId}/backup/api/v1/ecmgs` - Lista ECMGs configurados do mux de backup
- `GET /{systemId}/primary/api/v1/ecmg/status/{ecmgUid}` - Status de ECMG específico do mux principal
- `GET /{systemId}/backup/api/v1/ecmg/status/{ecmgUid}` - Status de ECMG específico do mux de backup

### Outputs e Estatísticas
- `GET /{systemId}/primary/api/v1/outputs` - Lista outputs configurados do mux principal
- `GET /{systemId}/backup/api/v1/outputs` - Lista outputs configurados do mux de backup
- `GET /{systemId}/primary/api/v1/stats` - Estatísticas do sistema do mux principal
- `GET /{systemId}/backup/api/v1/stats` - Estatísticas do sistema do mux de backup

### PSI e Scrambling
- `GET /{systemId}/primary/api/v1/psi` - Informações PSI do mux principal
- `GET /{systemId}/backup/api/v1/psi` - Informações PSI do mux de backup
- `GET /{systemId}/primary/api/v1/scrambling` - Dados de scrambling do mux principal
- `GET /{systemId}/backup/api/v1/scrambling` - Dados de scrambling do mux de backup

### Utilitários
- `GET /{systemId}/primary/health` - Health check do mux principal
- `GET /{systemId}/backup/health` - Health check do mux de backup
- `GET /{systemId}/primary/status` - Status geral do sistema do mux principal
- `GET /{systemId}/backup/status` - Status geral do sistema do mux de backup

## 🔧 Exemplos de Uso

### Listar sistemas disponíveis
```bash
curl http://localhost:3000/systems
```

### Listar informações de muxes de um sistema
```bash
curl http://localhost:3000/j10/muxes
```

### Testar alarmes ativos do J12 (Primary)
```bash
curl http://localhost:3000/j12/primary/api/v1/alarms/active
```

### Verificar status do J14 (Backup)
```bash
curl http://localhost:3000/j14/backup/health
```

### Obter ECMGs do J16 (Compatibilidade - Primary)
```bash
curl http://localhost:3000/j16/api/v1/ecmgs
```

## 🎯 Características do Simulador

### Simulação de Instabilidade
- 5% de chance de timeout (35 segundos)
- 10% de chance de sistema offline
- Dados variáveis entre requisições

### Dados Realistas
- Estruturas baseadas nos exemplos do projeto original
- UIDs e timestamps dinâmicos
- Valores de bitrate e PIDs realistas

### Compatibilidade
- CORS habilitado para desenvolvimento
- Estrutura de dados idêntica à API real
- Headers e formatos de resposta compatíveis
- Endpoints antigos redirecionam para o mux PRIMARY

## 🛠️ Configuração do Frontend

Para usar este simulador com o projeto titan-muxe-vision, atualize o arquivo `muxes.json`:

```json
{
  "J02": {
    "primary": "localhost:3000/j02/primary",
    "backup": "localhost:3000/j02/backup"
  },
  "J04": {
    "primary": "localhost:3000/j04/primary",
    "backup": "localhost:3000/j04/backup"
  },
  "J06": {
    "primary": "localhost:3000/j06/primary",
    "backup": "localhost:3000/j06/backup"
  },
  "J08": {
    "primary": "localhost:3000/j08/primary",
    "backup": "localhost:3000/j08/backup"
  },
  "J10": {
    "primary": "localhost:3000/j10/primary",
    "backup": "localhost:3000/j10/backup"
  },
  "J12": {
    "primary": "localhost:3000/j12/primary",
    "backup": "localhost:3000/j12/backup"
  },
  "J14": {
    "primary": "localhost:3000/j14/primary",
    "backup": "localhost:3000/j14/backup"
  },
  "J16": {
    "primary": "localhost:3000/j16/primary",
    "backup": "localhost:3000/j16/backup"
  },
  "J18": {
    "primary": "localhost:3000/j18/primary",
    "backup": "localhost:3000/j18/backup"
  },
  "J20": {
    "primary": "localhost:3000/j20/primary",
    "backup": "localhost:3000/j20/backup"
  }
}
```

## 📊 Estrutura do Projeto

```
src/
├── interfaces/          # Definições de tipos TypeScript
├── services/           # Serviços de dados
├── controllers/        # Controladores de rotas
├── app.module.ts       # Módulo principal
└── main.ts            # Ponto de entrada
```

## 🔍 Logs e Monitoramento

O simulador registra:
- Requisições por sistema
- Timeouts simulados
- Status de cada sistema
- Dados retornados

## 🚨 Notas Importantes

1. **Ambiente de Desenvolvimento**: Este simulador é apenas para teste e desenvolvimento
2. **Dados Fictícios**: Todos os dados são gerados artificialmente
3. **Performance**: Projetado para simular condições reais de rede
4. **Compatibilidade**: Mantém compatibilidade total com a API original

## 🤝 Contribuição

Para adicionar novos endpoints ou sistemas:
1. Adicione interfaces em `src/interfaces/`
2. Implemente métodos no `DataService`
3. Adicione rotas no `MuxController`
4. Atualize esta documentação 