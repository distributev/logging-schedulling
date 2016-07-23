:: Name:     testRedis.bat
:: Purpose:  Script to test redis server configuration
:: Author:   Luis Manuel <luisman40@gmail.com>
:: Revision: June 2016 - initial version

@ECHO OFF
SETLOCAL ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

:: variables
SET rootdir=%~dps0
:: Redis executable directory
SET redispath=%rootdir%

SET redishost=127.0.0.1
SET redisport=6379
ECHO Redis Host %redishost%:%redisport%

:: Testing Redis
ECHO Inserting key1="Hello": SET key1 "Hello"
%redispath%redis-cli -h %redishost% -p %redisport% SET key1 "Hello"
ECHO Getting value of key1: GET key1
%redispath%redis-cli -h %redishost% -p %redisport% GET key1
ECHO Appeding " World" to the value of key1: APPEND key1 " World"
%redispath%redis-cli -h %redishost% -p %redisport% APPEND key1 " World"
ECHO Getting new value of key1: GET key1
%redispath%redis-cli -h %redishost% -p %redisport% GET key1
ECHO Deleting key1: DEL key1
%redispath%redis-cli -h %redishost% -p %redisport% DEL key1
ECHO Verifying key1 was deleted: GET key1
%redispath%redis-cli -h %redishost% -p %redisport% GET key1

PAUSE
ECHO ON
