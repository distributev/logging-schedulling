:: Name:     stopApp.bat
:: Purpose:  Script to stop the application on Windows
:: Author:   Luis Manuel <luisman40@gmail.com>
:: Revision: June 2016 - initial version

@ECHO OFF
SETLOCAL ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

:: Kill nodejs.exe for graceful termination
TASKKILL /F /PID nodejs.exe

:: PAUSE
ECHO ON

