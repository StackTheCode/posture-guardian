@echo off
echo Testing Settings Synchronization
echo.
echo 1. Start the desktop agent
echo 2. Change settings in web dashboard
echo 3. Wait 30 seconds
echo 4. Check agent console for "Settings updated" message
echo.

cd ..\..
build\posture-guardian.exe

pause