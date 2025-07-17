#!/bin/bash

# Script para exportar la aplicación Flashcards-A1 a un directorio de destino.
# Uso: ./exportApp.bash /ruta/al/directorio/destino

DEST_DIR="$1"

# Verificar si se proporcionó un directorio de destino
if [ -z "$DEST_DIR" ]; then
  echo "Uso: $0 /ruta/al/directorio/destino"
  exit 1
fi

# Crear el directorio de destino si no existe
mkdir -p "$DEST_DIR"

# Copiar todos los archivos y directorios, excluyendo .git y node_modules
# Pero incluyendo package.json y package-lock.json

# Copiar archivos y directorios de nivel superior, excluyendo .git y node_modules
find . -maxdepth 1 -mindepth 1 -not -name ".git" -not -name "node_modules" -exec cp -r {} "$DEST_DIR" \;

# Copiar package.json y package-lock.json de la raíz
cp ./package.json "$DEST_DIR" 2>/dev/null
cp ./package-lock.json "$DEST_DIR" 2>/dev/null

# Copiar package.json y package-lock.json de flashcards-a1-backend
cp ./flashcards-a1-backend/package.json "$DEST_DIR/flashcards-a1-backend/" 2>/dev/null
cp ./flashcards-a1-backend/package-lock.json "$DEST_DIR/flashcards-a1-backend/" 2>/dev/null

# Copiar package.json y package-lock.json de flashcards-a1-frontend
cp ./flashcards-a1-frontend/package.json "$DEST_DIR/flashcards-a1-frontend/" 2>/dev/null
cp ./flashcards-a1-frontend/package.lock.json "$DEST_DIR/flashcards-a1-frontend/" 2>/dev/null


echo "Archivos copiados a $DEST_DIR"

# Ejecutar npm install en el directorio de destino
echo "Ejecutando npm install en $DEST_DIR..."
cd "$DEST_DIR"
npm install

# Ejecutar npm install en los subdirectorios flashcards-a1-backend y flashcards-a1-frontend
if [ -d "flashcards-a1-backend" ]; then
  echo "Ejecutando npm install en flashcards-a1-backend..."
  cd flashcards-a1-backend
  npm install
  cd ..
fi

if [ -d "flashcards-a1-frontend" ]; then
  echo "Ejecutando npm install en flashcards-a1-frontend..."
  cd flashcards-a1-frontend
  npm install
  cd ..
fi

echo "Exportación completada."