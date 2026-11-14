#!/usr/bin/env bash
# ==============================================================================
# HeroCMS Unified Local Development Runner
# 
# Menjalankan seluruh stack pengembangan lokal secara bersamaan:
# 1. Service 03: Provision Orchestrator (Golang API - Port 8083)
# 2. Service 02: Dashboard CMS Backend (Golang API - Port 8085)
# 3. Service 02: Dashboard CMS Frontend (Vue 3 / Vite - Port 5173)
# ==============================================================================

set -eo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# ANSI Colors (Bash ANSI-C Quoting)
CLR_RESET=$'\033[0m'
CLR_BOLD=$'\033[1m'
CLR_CYAN=$'\033[36m'
CLR_GREEN=$'\033[32m'
CLR_MAGENTA=$'\033[35m'
CLR_YELLOW=$'\033[33m'
CLR_RED=$'\033[31m'
CLR_BLUE=$'\033[34m'

# Default Ports
PORT_ORCHESTRATOR="${ORCHESTRATOR_PORT:-8083}"
PORT_DASHBOARD_BACKEND="${DASHBOARD_BACKEND_PORT:-8085}"
PORT_DASHBOARD_UI="${VITE_PORT:-5173}"

# Array untuk menampung PID proses aktif
PIDS=()

# ------------------------------------------------------------------------------
# Helper: Rekursif mematikan pohon proses
# ------------------------------------------------------------------------------
kill_process_tree() {
    local parent_pid=$1
    if [ -n "$parent_pid" ] && kill -0 "$parent_pid" 2>/dev/null; then
        local children
        children=$(pgrep -P "$parent_pid" 2>/dev/null || true)
        for child in $children; do
            kill_process_tree "$child"
        done
        kill "$parent_pid" 2>/dev/null || true
    fi
}

# ------------------------------------------------------------------------------
# Helper: Membersihkan proses lama yang menduduki port tertentu
# ------------------------------------------------------------------------------
free_port() {
    local port=$1
    local name=$2
    local raw_pids
    raw_pids=$(lsof -ti ":$port" 2>/dev/null || fuser "$port/tcp" 2>/dev/null || true)
    if [ -n "$raw_pids" ]; then
        local pids_clean
        pids_clean=$(echo "$raw_pids" | tr '\n' ' ' | xargs)
        echo -e "${CLR_YELLOW}⚠️  Port $port ($name) sedang digunakan oleh PID: $pids_clean. Membersihkan...${CLR_RESET}"
        for p in $raw_pids; do
            kill "$p" 2>/dev/null || true
        done
        sleep 0.5
        # Force kill jika masih belum lepas
        raw_pids=$(lsof -ti ":$port" 2>/dev/null || true)
        if [ -n "$raw_pids" ]; then
            for p in $raw_pids; do
                kill -9 "$p" 2>/dev/null || true
            done
        fi
        echo -e "${CLR_GREEN}✓ Port $port berhasil dibebaskan.${CLR_RESET}"
    fi
}

# ------------------------------------------------------------------------------
# Graceful Shutdown Handler
# ------------------------------------------------------------------------------
cleanup() {
    trap - SIGINT SIGTERM EXIT
    echo ""
    echo -e "${CLR_BOLD}${CLR_YELLOW}======================================================================${CLR_RESET}"
    echo -e "${CLR_BOLD}${CLR_YELLOW} 🛑 Menghentikan seluruh service dev HeroCMS...                       ${CLR_RESET}"
    echo -e "${CLR_BOLD}${CLR_YELLOW}======================================================================${CLR_RESET}"

    for pid in "${PIDS[@]}"; do
        kill_process_tree "$pid"
    done

    wait 2>/dev/null || true

    # Verifikasi port dibebaskan
    free_port "$PORT_DASHBOARD_UI" "Dashboard UI"
    free_port "$PORT_DASHBOARD_BACKEND" "Dashboard Go"
    free_port "$PORT_ORCHESTRATOR" "Orchestrator Go"

    echo -e "${CLR_BOLD}${CLR_GREEN}✅ Seluruh proses dev telah dihentikan dengan aman. Sampai jumpa!${CLR_RESET}"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# ------------------------------------------------------------------------------
# Validasi Persyaratan Lingkungan (Go & Node.js/NPM)
# ------------------------------------------------------------------------------
echo -e "${CLR_BOLD}${CLR_BLUE}======================================================================${CLR_RESET}"
echo -e "${CLR_BOLD}${CLR_BLUE} 🚀 HEROCMS UNIFIED LOCAL DEVELOPMENT RUNNER                         ${CLR_RESET}"
echo -e "${CLR_BOLD}${CLR_BLUE}======================================================================${CLR_RESET}"

if ! command -v go >/dev/null 2>&1; then
    echo -e "${CLR_RED}❌ Error: 'go' tidak ditemukan di PATH sistem.${CLR_RESET}"
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo -e "${CLR_RED}❌ Error: 'npm' tidak ditemukan di PATH sistem.${CLR_RESET}"
    exit 1
fi

# Validasi direktori service
DIR_DASHBOARD="$REPO_ROOT/services/02-dashboard-cms"
DIR_ORCHESTRATOR="$REPO_ROOT/services/03-provision-orchestrator"

if [ ! -d "$DIR_DASHBOARD" ]; then
    echo -e "${CLR_RED}❌ Error: Direktori $DIR_DASHBOARD tidak ditemukan.${CLR_RESET}"
    exit 1
fi

if [ ! -d "$DIR_ORCHESTRATOR" ]; then
    echo -e "${CLR_RED}❌ Error: Direktori $DIR_ORCHESTRATOR tidak ditemukan.${CLR_RESET}"
    exit 1
fi

# Pastikan direktori tenant storage (/var/lib/herocms/tenants) memiliki izin tulis
if [ -d "/var/lib/herocms" ] && [ ! -w "/var/lib/herocms/tenants" ]; then
    if sudo -n true 2>/dev/null; then
        echo -e "${CLR_YELLOW}🔧 Mengatur permission /var/lib/herocms/tenants agar dapat ditulis oleh non-root dev...${CLR_RESET}"
        sudo mkdir -p /var/lib/herocms/tenants
        sudo chown -R "$(id -u):$(id -g)" /var/lib/herocms
        sudo chmod -R 0777 /var/lib/herocms
    fi
fi

# Pastikan dependencies frontend terpasang
if [ ! -d "$DIR_DASHBOARD/node_modules" ]; then
    echo -e "${CLR_YELLOW}📦 node_modules belum terpasang di 02-dashboard-cms. Menjalankan npm install...${CLR_RESET}"
    (cd "$DIR_DASHBOARD" && npm install)
fi

# Bersihkan port dari proses sebelumnya jika ada
free_port "$PORT_ORCHESTRATOR" "Orchestrator Go"
free_port "$PORT_DASHBOARD_BACKEND" "Dashboard Go"
free_port "$PORT_DASHBOARD_UI" "Dashboard UI"

echo ""
echo -e "${CLR_BOLD}Daftar Layanan yang Dijalankan:${CLR_RESET}"
echo -e "  ${CLR_CYAN}• Service 03 (Orchestrator) : http://localhost:$PORT_ORCHESTRATOR${CLR_RESET}"
echo -e "  ${CLR_GREEN}• Service 02 (Dashboard Go) : http://localhost:$PORT_DASHBOARD_BACKEND${CLR_RESET}"
echo -e "  ${CLR_MAGENTA}• Service 02 (Dashboard UI) : http://localhost:$PORT_DASHBOARD_UI${CLR_RESET}"
echo ""
echo -e "${CLR_BOLD}Tekan ${CLR_RED}Ctrl+C${CLR_RESET}${CLR_BOLD} kapan saja untuk mematikan seluruh service.${CLR_RESET}"
echo -e "${CLR_BOLD}----------------------------------------------------------------------${CLR_RESET}"

# Prefix formatters
PREFIX_ORCH="${CLR_CYAN}[03-orchestrator]${CLR_RESET} "
PREFIX_DASH_GO="${CLR_GREEN}[02-dashboard-go]${CLR_RESET} "
PREFIX_DASH_UI="${CLR_MAGENTA}[02-dashboard-ui]${CLR_RESET} "

# ------------------------------------------------------------------------------
# 1. Jalankan Service 03: Provision Orchestrator (Golang API)
# ------------------------------------------------------------------------------
(
    cd "$DIR_ORCHESTRATOR"
    PORT="$PORT_ORCHESTRATOR" exec go run ./cmd/api
) > >(sed -u "s/^/$PREFIX_ORCH/") 2>&1 &
PID_ORCH=$!
PIDS+=("$PID_ORCH")

# Berikan jeda sejenak agar orchestrator siap sebelum BFF dashboard terhubung
sleep 1

# ------------------------------------------------------------------------------
# 2. Jalankan Service 02: Dashboard CMS Backend (Golang API)
# ------------------------------------------------------------------------------
(
    cd "$DIR_DASHBOARD"
    PORT="$PORT_DASHBOARD_BACKEND" \
    ORCHESTRATOR_URL="http://127.0.0.1:$PORT_ORCHESTRATOR" \
    exec go run ./cmd/server
) > >(sed -u "s/^/$PREFIX_DASH_GO/") 2>&1 &
PID_DASH_GO=$!
PIDS+=("$PID_DASH_GO")

sleep 1

# ------------------------------------------------------------------------------
# 3. Jalankan Service 02: Dashboard CMS Frontend (Vite Dev Server)
# ------------------------------------------------------------------------------
(
    cd "$DIR_DASHBOARD"
    exec npm run dev
) > >(sed -u "s/^/$PREFIX_DASH_UI/") 2>&1 &
PID_DASH_UI=$!
PIDS+=("$PID_DASH_UI")

# Tunggu seluruh proses background berjalan
wait "${PIDS[@]}"
