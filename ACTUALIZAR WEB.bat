@echo off
cd /d "%~dp0"

echo.
echo ==============================
echo        ACTUALIZANDO KRAKOA
echo ==============================
echo.

echo [1/4] Generando catalogo...
node scripts\generar-catalogo.mjs

if errorlevel 1 (
    echo.
    echo ERROR: No se pudo generar el catalogo.
    pause
    exit /b 1
)

echo.
echo [2/4] Generando sitio web...
call npm.cmd run build

if errorlevel 1 (
    echo.
    echo ERROR: No se pudo generar el sitio web.
    pause
    exit /b 1
)

echo.
echo [3/4] Preparando cambios para Git...
git add .

if errorlevel 1 (
    echo.
    echo ERROR: No se pudieron preparar los cambios.
    pause
    exit /b 1
)

echo.
set /p MENSAJE="Descripcion del cambio: "

if "%MENSAJE%"=="" set "MENSAJE=Actualizacion de KRAKOA"

echo.
echo Creando commit...
git commit -m "%MENSAJE%"

if errorlevel 1 (
    echo.
    echo ADVERTENCIA: No se creo un nuevo commit.
    echo Puede que no haya cambios nuevos.
    echo.
)

echo.
echo [4/4] Publicando en GitHub...
git push

if errorlevel 1 (
    echo.
    echo ERROR: No se pudo publicar en GitHub.
    pause
    exit /b 1
)

echo.
echo ==============================
echo     KRAKOA PUBLICADO
echo ==============================
echo.
echo Los cambios fueron enviados a GitHub.
echo GitHub Pages actualizara el sitio automaticamente.
echo.

pause