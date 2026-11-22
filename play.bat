@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Bricks of Egypt & Jardinains - Classic Arcade Suite

echo ======================================================================
echo           BRICKS OF EGYPT & JARDINAINS! - ARCADE SUITE
echo ======================================================================
echo.
echo Launching arcade suite for instant play...
echo.

:: Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    python "%~dp0launch.py"
    exit /b
)

:: Fallback: Open index.html directly in the default browser
echo Python not detected. Opening index.html directly in your web browser...
start "" "%~dp0index.html"

echo.
echo Game opened! Enjoy playing Bricks of Egypt and Jardinains!
echo.
echo Hotkeys:
echo   - 1: Play Bricks of Egypt (40 Levels & 8 Packs)
echo   - 2: Play Jardinains! (Gnomes & Juggling)
echo   - 3: Play Mashup Mode (Gnomes in Egypt)
echo   - Mouse or Left/Right Arrow keys: Move paddle
echo   - Click or Spacebar: Launch ball and fire lasers/harpoons
echo   - P: Pause
echo   - M: Toggle Sound
echo   - L: Select Level
echo   - E: Level Editor
echo.
timeout /t 5 >nul
