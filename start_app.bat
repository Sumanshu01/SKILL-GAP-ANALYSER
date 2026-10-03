@echo off
echo ======================================================================
echo           AI RESUME SKILL GAP ANALYZER — FULL APPLICATION
echo ======================================================================
echo 1. Starting Backend API on http://localhost:8000
start "AI Analyzer - Backend API (FastAPI)" cmd /c "%~dp0run_backend.bat"

timeout /t 3 /nobreak >nul

echo 2. Starting Frontend on http://localhost:5173
start "AI Analyzer - Frontend (Vite/React)" cmd /c "%~dp0run_frontend.bat"

echo ======================================================================
echo Both servers have been launched in separate terminal windows.
echo Frontend: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
echo ======================================================================
pause
