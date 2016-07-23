:: Name:     startApp.bat
:: Purpose:  Script to start the application on Windows
:: Author:   Luis Manuel <luisman40@gmail.com>
:: Revision: June 2016 - initial version

@ECHO OFF
SET NODE_ENV=production
SETLOCAL ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

:: variables
SET rootdir=%~dps0
:: NodeJS
SET node=%rootdir%_internal\runtime\nodejs\nodejs

%node% %rootdir%_internal\app\server

:: PAUSE
ECHO ON


