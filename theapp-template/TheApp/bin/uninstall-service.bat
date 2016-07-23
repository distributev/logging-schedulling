:: Name:     uninstall-service.bat
:: Purpose:  Wrapper to uninstall the app Service
:: Author:   Luis Manuel <luisman40@gmail.com>
:: Revision: June 2016 - initial version

@ECHO OFF
SETLOCAL ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

:: variables
SET rootdir=%~dps0
:: NodeJS
SET node=%rootdir%..\_internal\runtime\nodejs\nodejs

ECHO Uninstalling Service...

%node% %rootdir%uninstall-service.js

:: PAUSE
ECHO ON
