@echo off
title Chromatic Pact - Servidor do Jogo
cd /d "%~dp0"
echo Iniciando Chromatic Pact em http://localhost:5173 ...
start http://localhost:5173
node ./node_modules/vite/bin/vite.js --port 5173
pause
