@echo off
cd /d "%~dp0"

echo.
echo ==============================
echo       ACTUALIZANDO KRAKOA
echo ==============================
echo.

echo [1/2] Generando catalogo...
node scripts\generar-catalogo.mjs

if errorlevel 1 (
    echo.
    echo ERROR: No se pudo generar el catalogo.
    pause
    exit /b 1
)

echo.
echo [2/2] Generando sitio web...
call npm.cmd run build

if errorlevel 1 (
    echo.
    echo ERROR: No se pudo generar el sitio web.
    pause
    exit /b 1
)

echo.
echo ==============================
echo   SITIO ACTUALIZADO
echo ==============================
echo.

pause