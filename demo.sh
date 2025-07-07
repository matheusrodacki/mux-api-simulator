#!/bin/bash

echo "🚀 Demonstração do Simulador de API dos Muxes (J02, J04, J06, J08)"
echo "============================================================"
echo ""

BASE_URL="http://localhost:3000"

echo "📋 Lista de sistemas disponíveis:"
curl -s "${BASE_URL}/systems" | jq '.' 2>/dev/null || curl -s "${BASE_URL}/systems"
echo ""

echo "📡 Testando endpoints para sistema J02 (Primary e Backup):"
echo ""

echo "1. Health Check - Primary:"
curl -s "${BASE_URL}/j02/primary/health" | jq '.' 2>/dev/null || curl -s "${BASE_URL}/j02/primary/health"
echo ""

echo "2. Status do Sistema - Primary:"
curl -s "${BASE_URL}/j02/primary/status" | jq '.' 2>/dev/null || curl -s "${BASE_URL}/j02/primary/status"
echo ""

echo "3. Alarmes Ativos - Primary:"
curl -s "${BASE_URL}/j02/primary/api/v1/alarms/active" | jq '.' 2>/dev/null || curl -s "${BASE_URL}/j02/primary/api/v1/alarms/active"
echo ""

echo "4. Contagem de Alarmes - Primary:"
curl -s "${BASE_URL}/j02/primary/api/v1/alarms/active/count"
echo ""

echo "5. ECMGs Configurados - Primary:"
curl -s "${BASE_URL}/j02/primary/api/v1/ecmgs" | jq '.[0].Name' 2>/dev/null || curl -s "${BASE_URL}/j02/primary/api/v1/ecmgs"
echo ""

echo "1. Health Check - Backup:"
curl -s "${BASE_URL}/j02/backup/health" | jq '.' 2>/dev/null || curl -s "${BASE_URL}/j02/backup/health"
echo ""

echo "2. Status do Sistema - Backup:"
curl -s "${BASE_URL}/j02/backup/status" | jq '.' 2>/dev/null || curl -s "${BASE_URL}/j02/backup/status"
echo ""

echo "3. Alarmes Ativos - Backup:"
curl -s "${BASE_URL}/j02/backup/api/v1/alarms/active" | jq '.' 2>/dev/null || curl -s "${BASE_URL}/j02/backup/api/v1/alarms/active"
echo ""

echo "4. Contagem de Alarmes - Backup:"
curl -s "${BASE_URL}/j02/backup/api/v1/alarms/active/count"
echo ""

echo "5. ECMGs Configurados - Backup:"
curl -s "${BASE_URL}/j02/backup/api/v1/ecmgs" | jq '.[0].Name' 2>/dev/null || curl -s "${BASE_URL}/j02/backup/api/v1/ecmgs"
echo ""

echo "🔄 Testando endpoint de compatibilidade (J04):"
curl -s "${BASE_URL}/j04/health" | jq '.system' 2>/dev/null || curl -s "${BASE_URL}/j04/health"
echo ""

echo "❌ Testando sistema inválido (J01):"
curl -s "${BASE_URL}/j01/health" 2>/dev/null || echo "Sistema não encontrado (esperado)"
echo ""

echo "✅ Demonstração concluída!"
echo ""
echo "🔗 Sistemas disponíveis: J02, J04, J06, J08"
echo "🔗 Exemplo para qualquer sistema (Primary): ${BASE_URL}/j06/primary/api/v1/alarms/active"
echo "🔗 Exemplo para qualquer sistema (Backup): ${BASE_URL}/j06/backup/api/v1/alarms/active"
echo "🔗 Lista completa: ${BASE_URL}/systems" 