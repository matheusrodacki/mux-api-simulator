#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Apenas os 10 sistemas selecionados: J02 ao J20 (apenas pares)
const SYSTEMS = [
  'j02',
  'j04',
  'j06',
  'j08',
  'j10',
  'j12',
  'j14',
  'j16',
  'j18',
  'j20',
];

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function testEndpoints() {
  console.log('🧪 Testando endpoints do simulador MUX...\n');

  // Testa endpoint de sistemas disponíveis
  console.log('📋 Testando lista de sistemas:');
  try {
    const result = await makeRequest('/systems');
    const status = result.status === 200 ? '✅' : '❌';
    console.log(`  ${status} /systems - Status: ${result.status}`);
    if (result.status === 200) {
      console.log(`  📊 Total de sistemas: ${result.data.total}`);
      console.log(`  📡 Sistemas: ${result.data.systems.join(', ')}`);
      console.log(`  🔄 Tipos de MUX: ${result.data.muxTypes.join(', ')}`);
    }
  } catch (error) {
    console.log(`  ❌ /systems - Error: ${error.message}`);
  }
  console.log('');

  // Testa informações de MUX para cada sistema
  console.log('📡 Testando informações de MUX por sistema:');
  for (const system of SYSTEMS) {
    try {
      const result = await makeRequest(`/${system}/muxes`);
      const status = result.status === 200 ? '✅' : '❌';
      console.log(`  ${status} /${system}/muxes - Status: ${result.status}`);
      if (result.status === 200) {
        console.log(`    🔧 PRIMARY: ${result.data.muxes.primary.name}`);
        console.log(`    🔧 BACKUP: ${result.data.muxes.backup.name}`);
      }
    } catch (error) {
      console.log(`  ❌ /${system}/muxes - Error: ${error.message}`);
    }
  }
  console.log('');

  // Testa endpoints principais (J02, J08, J12, J18 como exemplo)
  const testSystems = ['j02', 'j08', 'j12', 'j18'];

  for (const system of testSystems) {
    console.log(`📡 Testando sistema ${system.toUpperCase()}:`);
    console.log('');

    // Testa MUX PRIMARY
    console.log(`  🔧 MUX PRIMARY:`);
    const primaryEndpoints = [
      `/health`,
      `/status`,
      `/api/v1/alarms/active`,
      `/api/v1/alarms/active/count`,
      `/api/v1/ecmgs`,
      `/api/v1/outputs`,
      `/api/v1/stats`,
      `/api/v1/mux/outputs/1/psi`,
      `/api/v1/scrambling`,
    ];

    for (const endpoint of primaryEndpoints) {
      try {
        const result = await makeRequest(`/${system}/primary${endpoint}`);
        const status = result.status === 200 ? '✅' : '❌';
        console.log(`    ${status} ${endpoint} - Status: ${result.status}`);
      } catch (error) {
        console.log(`    ❌ ${endpoint} - Error: ${error.message}`);
      }
    }

    console.log('');

    // Testa MUX BACKUP
    console.log(`  🔧 MUX BACKUP:`);
    const backupEndpoints = [
      `/health`,
      `/status`,
      `/api/v1/alarms/active`,
      `/api/v1/alarms/active/count`,
      `/api/v1/ecmgs`,
      `/api/v1/outputs`,
      `/api/v1/stats`,
      `/api/v1/mux/outputs/1/psi`,
      `/api/v1/scrambling`,
    ];

    for (const endpoint of backupEndpoints) {
      try {
        const result = await makeRequest(`/${system}/backup${endpoint}`);
        const status = result.status === 200 ? '✅' : '❌';
        console.log(`    ${status} ${endpoint} - Status: ${result.status}`);
      } catch (error) {
        console.log(`    ❌ ${endpoint} - Error: ${error.message}`);
      }
    }

    console.log('');

    // Testa endpoints de compatibilidade (versão antiga)
    console.log(`  🔄 COMPATIBILIDADE (redireciona para PRIMARY):`);
    const compatibilityEndpoints = [
      `/health`,
      `/status`,
      `/api/v1/alarms/active`,
      `/api/v1/outputs`,
      `/api/v1/mux/outputs/1/psi`,
    ];

    for (const endpoint of compatibilityEndpoints) {
      try {
        const result = await makeRequest(`/${system}${endpoint}`);
        const status = result.status === 200 ? '✅' : '❌';
        console.log(`    ${status} ${endpoint} - Status: ${result.status}`);
      } catch (error) {
        console.log(`    ❌ ${endpoint} - Error: ${error.message}`);
      }
    }

    console.log('');
  }

  console.log('🎯 Teste concluído!');
  console.log(`📊 Total de sistemas disponíveis: ${SYSTEMS.length}`);
  console.log(`📡 Sistemas: ${SYSTEMS.join(', ').toUpperCase()}`);
  console.log(`🔄 Tipos de MUX: PRIMARY, BACKUP`);
  console.log('');
  console.log('📖 Exemplos de uso:');
  console.log(
    '  🔧 MUX Primary: curl http://localhost:3000/j10/primary/health'
  );
  console.log('  🔧 MUX Backup:  curl http://localhost:3000/j12/backup/health');
  console.log('  🔄 Compatibilidade: curl http://localhost:3000/j14/health');
  console.log('  📋 Lista sistemas: curl http://localhost:3000/systems');
  console.log('  📡 Info MUX: curl http://localhost:3000/j16/muxes');
}

// Aguarda o servidor iniciar
setTimeout(() => {
  testEndpoints().catch(console.error);
}, 3000);
