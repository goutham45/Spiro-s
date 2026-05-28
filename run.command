#!/bin/bash

echo ""
echo " ========================================"
echo "   Spiro's Diner — Starting Services"
echo " ========================================"
echo ""

# ── ROOT DIR ──────────────────────────────────────────────────────
ROOT="$(cd "$(dirname "$0")" && pwd)"

# ── KILL ANYTHING ON OUR PORTS ───────────────────────────────────
echo "⏹  Stopping any previous services..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
sleep 1
echo "   Ports 8000 and 8080 cleared."

# ── START MYSQL ───────────────────────────────────────────────────
echo ""
echo "🗄️  Starting MySQL..."
if brew services list 2>/dev/null | grep -q "mysql.*started"; then
    echo "   MySQL already running."
else
    brew services start mysql 2>/dev/null || \
    sudo /usr/local/mysql/support-files/mysql.server start 2>/dev/null || \
    mysqld_safe --daemonize 2>/dev/null || \
    echo "   ⚠️  Could not auto-start MySQL. Start it manually if needed."
    sleep 2
fi

# ── START BACKEND ─────────────────────────────────────────────────
echo ""
echo "🚀  Starting backend (port 8000)..."
cd "$ROOT/backend" && npm start > /tmp/spiros_backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID  (logs: /tmp/spiros_backend.log)"

# Wait for backend to be ready
for i in $(seq 1 15); do
    sleep 1
    if curl -s http://localhost:8000/ >/dev/null 2>&1; then
        echo "   ✅ Backend is up!"
        break
    fi
    if [ $i -eq 15 ]; then
        echo "   ⚠️  Backend taking longer than expected. Check /tmp/spiros_backend.log"
    fi
done

# ── START FRONTEND ────────────────────────────────────────────────
echo ""
echo "🖥️  Starting frontend (port 8080)..."
cd "$ROOT/frontend" && npm run serve > /tmp/spiros_frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID  (logs: /tmp/spiros_frontend.log)"

# ── WAIT FOR FRONTEND + OPEN BROWSER ─────────────────────────────
echo ""
echo "⏳  Waiting for website to be ready..."
for i in $(seq 1 45); do
    sleep 2
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 2>/dev/null)
    if echo "$STATUS" | grep -qE "^[23]"; then
        echo ""
        echo " ✅  Website is live!"
        echo " 🌐  Opening http://localhost:8080 ..."
        echo ""
        open http://localhost:8080
        break
    fi
    if [ $i -eq 45 ]; then
        echo ""
        echo " ⚠️  Frontend taking longer than expected."
        echo "     Check /tmp/spiros_frontend.log for errors."
        echo "     Try opening http://localhost:8080 manually."
    fi
done

echo " ========================================="
echo "   Services running. Press Ctrl+C to stop."
echo " ========================================="
echo ""
echo "   Backend  → http://localhost:8000"
echo "   Frontend → http://localhost:8080"
echo ""

# Keep script alive so Ctrl+C kills both processes
trap "echo ''; echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Done.'; exit 0" INT
wait
