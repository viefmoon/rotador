# Proxy LLM con Rotación de Claves

Este proyecto implementa un proxy para servicios de LLM (Large Language Models) con capacidad de rotación de claves API.

## Características

- Proxy HTTP para servicios LLM
- Rotación automática de claves API
- Limitación de tasa de solicitudes
- Configuración mediante variables de entorno

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- TypeScript

## Instalación

1. Clonar el repositorio:

```bash
git clone [URL_DEL_REPOSITORIO]
cd proxy-llm
```

2. Instalar dependencias:

```bash
npm install
```

## Configuración

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
PORT=8765
API_KEYS=key1,key2,key3
API_BASE_URL=https://api.ejemplo.com
```

## Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Para iniciar el servidor en modo producción:

```bash
npm start
```

## Uso

El proxy estará disponible en `http://localhost:8765` (o el puerto configurado).

## Estructura del Proyecto

- `proxy-llm.ts`: Archivo principal del servidor proxy
- `package.json`: Configuración del proyecto y dependencias
- `tsconfig.json`: Configuración de TypeScript

## Dependencias Principales

- Express: Framework web
- Axios: Cliente HTTP
- Express-rate-limit: Limitación de tasa
- dotenv: Gestión de variables de entorno

## Scripts Disponibles

- `npm start`: Inicia el servidor en modo producción
- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática
