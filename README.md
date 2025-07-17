# Flashcards-A1

Este repositorio contiene una aplicación de flashcards con un frontend en React y un backend en Node.js.

## Scripts de Utilidad

### `exportApp.bash`

Este script permite exportar la aplicación completa (frontend y backend) a un directorio especificado, excluyendo archivos de control de versiones y módulos de Node.js, pero incluyendo los archivos `package.json` y `package-lock.json` necesarios para la instalación de dependencias.

**Uso:**

```bash
./exportApp.bash /ruta/al/directorio/destino
```

**Funcionalidad:**

1.  Verifica que se haya proporcionado un directorio de destino.
2.  Crea el directorio de destino si no existe.
3.  Copia todos los archivos y directorios del proyecto al directorio de destino, excluyendo:
    *   El directorio `.git`.
    *   Los directorios `node_modules`.
4.  Asegura la copia de los archivos `package.json` y `package-lock.json` de la raíz del proyecto, así como de los subdirectorios `flashcards-a1-backend` y `flashcards-a1-frontend`.
5.  Navega al directorio de destino y ejecuta `npm install` para instalar las dependencias del proyecto principal.
6.  Navega a los subdirectorios `flashcards-a1-backend` y `flashcards-a1-frontend` (si existen) y ejecuta `npm install` en cada uno para instalar sus dependencias respectivas.

### `exportApp.bat`

Este script es la versión para Windows de `exportApp.bash` y cumple la misma función de exportar la aplicación a un directorio especificado. Utiliza comandos de `batch` para realizar las operaciones de copia y gestión de directorios.

**Uso:**

```cmd
exportApp.bat <ruta_al_directorio_destino>
```

**Funcionalidad:**

La funcionalidad es idéntica a la de `exportApp.bash`, adaptada para el entorno Windows:

1.  Verifica que se haya proporcionado un directorio de destino.
2.  Crea el directorio de destino si no existe.
3.  Copia todos los archivos y directorios del proyecto al directorio de destino, excluyendo `.git` y `node_modules`.
4.  Asegura la copia de los archivos `package.json` y `package-lock.json` de la raíz del proyecto, así como de los subdirectorios `flashcards-a1-backend` y `flashcards-a1-frontend`.
5.  Navega al directorio de destino y ejecuta `npm install` para instalar las dependencias del proyecto principal.
6.  Navega a los subdirectorios `flashcards-a1-backend` y `flashcards-a1-frontend` (si existen) y ejecuta `npm install` en cada uno para instalar sus dependencias respectivas.