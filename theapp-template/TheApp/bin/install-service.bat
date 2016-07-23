:: Name:     install-service.bat
:: Purpose:  Wrapper to install the app as a service on Windows
:: Author:   Luis Manuel <luisman40@gmail.com>
:: Revision: June 2016 - initial version

@ECHO OFF
SETLOCAL ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

:: variables
SET rootdir=%~dps0
:: NodeJS
SET node=%rootdir%..\_internal\runtime\nodejs\nodejs

ECHO Installing Service...

%node% %rootdir%install-service.js

:: PAUSE
ECHO ON
