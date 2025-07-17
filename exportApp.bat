@echo off
REM Script para exportar la aplicación Flashcards-A1 a un directorio de destino.
REM Uso: exportApp.bat <ruta_al_directorio_destino>

set "DEST_DIR=%~1"

REM Verificar si se proporcionó un directorio de destino
if "%DEST_DIR%"=="" (
  echo Uso: %~nx0 ^<ruta_al_directorio_destino^>
  exit /b 1
)

REM Crear el directorio de destino si no existe
if not exist "%DEST_DIR%" (
  mkdir "%DEST_DIR%"
)

echo Copiando archivos a %DEST_DIR%...

REM Copiar todos los archivos y directorios, excluyendo .git y node_modules
REM Pero incluyendo package.json y package-lock.json

REM Copiar archivos y directorios de nivel superior, excluyendo .git y node_modules
for /D %%i in (*) do (
  if not "%%i"==".git" (
    if not "%%i"=="node_modules" (
      xcopy "%%i" "%DEST_DIR%\%%i" /E /I /Y >nul
    )
  )
)

REM Copiar archivos específicos de la raíz
copy "package.json" "%DEST_DIR%\" >nul 2>&1
copy "package-lock.json" "%DEST_DIR%\" >nul 2>&1

REM Copiar archivos específicos de flashcards-a1-backend
if exist "flashcards-a1-backend\package.json" (
  if not exist "%DEST_DIR%\flashcards-a1-backend" mkdir "%DEST_DIR%\flashcards-a1-backend"
  copy "flashcards-a1-backend\package.json" "%DEST_DIR%\flashcards-a1-backend\" >nul 2>&1
  copy "flashcards-a1-backend\package-lock.json" "%DEST_DIR%\flashcards-a1-backend\" >nul 2>&1
)

REM Copiar archivos específicos de flashcards-a1-frontend
if exist "flashcards-a1-frontend\package.json" (
  if not exist "%DEST_DIR%\flashcards-a1-frontend" mkdir "%DEST_DIR%\flashcards-a1-frontend"
  copy "flashcards-a1-frontend\package.json" "%DEST_DIR%\flashcards-a1-frontend\" >nul 2>&1
  copy "flashcards-a1-frontend\package-lock.json" "%DEST_DIR%\flashcards-a1-frontend\" >nul 2>&1
)

echo Archivos copiados a %DEST_DIR%

REM Ejecutar npm install en el directorio de destino
echo Ejecutando npm install en %DEST_DIR%...
pushd "%DEST_DIR%"
npm install

REM Ejecutar npm install en los subdirectorios flashcards-a1-backend y flashcards-a1-frontend
if exist "flashcards-a1-backend" (
  echo Ejecutando npm install en flashcards-a1-backend...
  pushd "flashcards-a1-backend"
  npm install
  popd
)

if exist "flashcards-a1-frontend" (
  echo Ejecutando npm install en flashcards-a1-frontend...
  pushd "flashcards-a1-frontend"
  npm install
  popd
)

popd
echo Exportación completada.
exit /b 0