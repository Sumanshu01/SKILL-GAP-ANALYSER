@echo off
echo Starting AI Resume Skill Gap Analyzer Backend API...
cd /d "%~dp0backend"
"C:\Users\PC\AppData\Local\Programs\Python\Python310\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
