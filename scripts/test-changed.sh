#!/usr/bin/env bash
# ==============================================================================
# Aether Core - Selective Pre-Push Quality Gate & Pentest Runner
# Hanya menguji microservice yang memiliki modifikasi kode atau versi baru.
# ==============================================================================

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "======================================================================"
echo " 🛡️ AETHER CORE: SELECTIVE LOCAL QUALITY GATE & PENTEST"
echo "======================================================================"

# Detect modified services via git status
CHANGED_FILES=$(git status --porcelain | awk '{print $2}')

if [ -z "$CHANGED_FILES" ]; then
  # If clean working tree, compare with HEAD~1 or origin/main
  CHANGED_FILES=$(git diff --name-only HEAD~1 2>/dev/null || git diff --name-only HEAD 2>/dev/null || true)
fi

RUN_02=false
RUN_03=false
RUN_04=false
RUN_05=false
RUN_07=false

for file in $CHANGED_FILES; do
  case "$file" in
    services/02-dashboard-cms/*) RUN_02=true ;;
    services/03-provision-orchestrator/*) RUN_03=true ;;
    services/04-marketing-site/*) RUN_04=true ;;
    services/05-ai-agent-service/*) RUN_05=true ;;
    services/07-docs/*) RUN_07=true ;;
  esac
done

# If argument passed (e.g. ./test-changed.sh 02), override
if [ "$1" == "02" ] || [ "$1" == "dashboard" ]; then RUN_02=true; fi
if [ "$1" == "03" ] || [ "$1" == "orchestrator" ]; then RUN_03=true; fi
if [ "$1" == "04" ] || [ "$1" == "marketing" ]; then RUN_04=true; fi
if [ "$1" == "05" ] || [ "$1" == "ai" ]; then RUN_05=true; fi
if [ "$1" == "07" ] || [ "$1" == "docs" ]; then RUN_07=true; fi
if [ "$1" == "all" ]; then
  RUN_02=true; RUN_03=true; RUN_04=true; RUN_05=true; RUN_07=true
fi

TOTAL_TESTED=0

test_service() {
  local service_dir="$1"
  local service_name="$2"
  local has_node="$3"
  local has_go="$4"

  echo ""
  echo "▶ [START] Testing $service_name ($service_dir)..."

  cd "$REPO_ROOT/$service_dir"

  if [ "$has_go" = "true" ]; then
    echo "  🔍 Running Go Vet..."
    go vet ./...
    if [ -d "pentest" ]; then
      echo "  🛡️ Running Security Pentest Suite..."
      go test -v ./pentest/...
    fi
  fi

  if [ "$has_node" = "true" ]; then
    echo "  📦 Running Frontend Type-Check & Build..."
    npm run build
  fi

  echo "  ✅ PASS: $service_name is 100% compliant."
  cd "$REPO_ROOT"
  TOTAL_TESTED=$((TOTAL_TESTED + 1))
}

if [ "$RUN_02" = "true" ]; then
  test_service "services/02-dashboard-cms" "Service 02: Dashboard CMS" "true" "true"
fi

if [ "$RUN_03" = "true" ]; then
  test_service "services/03-provision-orchestrator" "Service 03: Provision Orchestrator" "false" "true"
fi

if [ "$RUN_04" = "true" ]; then
  test_service "services/04-marketing-site" "Service 04: Marketing Site" "false" "true"
fi

if [ "$RUN_05" = "true" ]; then
  test_service "services/05-ai-agent-service" "Service 05: AI Agent Service" "false" "true"
fi

if [ "$RUN_07" = "true" ]; then
  test_service "services/07-docs" "Service 07: Docs Hub" "false" "true"
fi

echo ""
echo "======================================================================"
if [ $TOTAL_TESTED -eq 0 ]; then
  echo " ℹ️ Tidak ada perubahan pada direktori microservice. Tidak ada pengujian yang perlu dijalankan."
else
  echo " 🚀 Selesai! $TOTAL_TESTED service berhasil lolos uji tanpa error."
  echo " Status: SIAP UNTUK COMMIT & RELEASE."
fi
echo "======================================================================"
