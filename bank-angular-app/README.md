# 🏦 Bank Angular App - Sistema Bancario Frontend

![Angular](https://img.shields.io/badge/Angular-17+-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-brightgreen)
![Tests](https://img.shields.io/badge/Tests-Ready-success)

> **Frontend Angular** del sistema bancario full-stack. Interfaz moderna y profesional sin frameworks de estilos externos, implementando todas las mejores prácticas de Angular.

## 📑 Tabla de Contenidos

- [🎯 Descripción del Proyecto](#-descripción-del-proyecto)
- [⚡ Características Principales](#-características-principales)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📋 Requisitos Previos](#-requisitos-previos)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [🐳 Ejecución con Docker](#-ejecución-con-docker)
- [🧪 Ejecutar Pruebas](#-ejecutar-pruebas)
- [🏗️ Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [📱 Funcionalidades](#-funcionalidades)
- [🎨 Diseño y UX](#-diseño-y-ux)
- [🔧 Configuración](#-configuración)
- [🚀 Despliegue](#-despliegue)
- [👨‍💻 Autor](#-autor)

## 🎯 Descripción del Proyecto

Frontend Angular moderno y profesional para el sistema bancario, implementando todas las funcionalidades CRUD con una interfaz intuitiva y responsive. Desarrollado con **CSS puro** sin frameworks externos, siguiendo las mejores prácticas de Angular y diseño UX/UI.

### ✨ Aspectos Destacados del Ejercicio Técnico

- ✅ **Frontend en Angular** - Implementación completa y funcional
- ✅ **Manejo global de excepciones** - Interceptors centralizados
- ✅ **Logging** - Detallado en operaciones críticas
- ✅ **Exportación PDF** - Funcionalidad completa de reportes
- ✅ **Convenciones REST** - Endpoints en español coincidiendo con la API
- ✅ **Separación física** - Proyecto independiente bien estructurado
- ✅ **Caching** - Optimización de consultas frecuentes
- ✅ **Paginación** - Para listas grandes de datos

## ⚡ Características Principales

### 🎨 Interfaz de Usuario
- ✅ **Diseño Responsivo** - Adaptable a todos los dispositivos
- ✅ **CSS Puro** - Sin frameworks externos (Bootstrap, Material, etc.)
- ✅ **Animaciones Suaves** - Transiciones y efectos profesionales
- ✅ **Tema Bancario** - Colores y diseño apropiados para finanzas

### 🔧 Funcionalidades Técnicas
- ✅ **CRUD Completo** - Clientes, Cuentas, Movimientos, Reportes
- ✅ **Búsqueda Avanzada** - Con debouncing y filtros múltiples
- ✅ **Paginación Profesional** - Con controles completos
- ✅ **Validaciones en Tiempo Real** - Feedback inmediato
- ✅ **Notificaciones Automáticas** - Sistema de alertas global

### 🏗️ Arquitectura
- ✅ **Módulos Lazy-Loaded** - Carga bajo demanda
- ✅ **Interceptors HTTP** - Manejo centralizado de peticiones
- ✅ **Servicios Singleton** - Gestión eficiente del estado
- ✅ **Componentes Reutilizables** - Arquitectura modular

## 🛠️ Tecnologías Utilizadas

### Core Technologies
- **Angular 17+** - Framework principal
- **TypeScript 5.0+** - Lenguaje de desarrollo
- **RxJS** - Programación reactiva
- **CSS3** - Estilos puros sin frameworks

### Tools & DevOps
- **Angular CLI** - Herramientas de desarrollo
- **Docker** - Containerización
- **Git** - Control de versiones
- **Webpack** - Bundling (incluido en Angular CLI)

### Architecture Patterns
- **Lazy Loading** - Módulos bajo demanda
- **Reactive Programming** - RxJS Observables
- **Component Architecture** - Reutilización y modularidad
- **Service Layer** - Separación de responsabilidades

## 📋 Requisitos Previos

### Para Desarrollo Local
- [Node.js 18+](https://nodejs.org/) y npm
- [Angular CLI](https://angular.io/cli) - `npm install -g @angular/cli`
- [Git](https://git-scm.com/)
- Editor de código (VS Code recomendado)

### Para Ejecución con Docker
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- 2GB RAM disponible

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/rvegah/FullStackBankApp.git
cd FullStackBankApp/bank-angular-app
```

### 2. Instalar Dependencias
```bash
# Instalar packages
npm install

# Verificar instalación
ng version
```

### 3. Configurar Environment
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5089/api'
};
```

### 4. Ejecutar en Modo Desarrollo
```bash
# Ejecutar servidor de desarrollo
ng serve

# Con live reload
ng serve --open
```

### 5. Acceder a la Aplicación
- **Frontend**: `http://localhost:4200`
- **API Backend**: `http://localhost:5089` (debe estar corriendo)

## 🐳 Ejecución con Docker

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN ng build --configuration production

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/* /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Ejecutar con Docker
```bash
# Construir imagen
docker build -t bank-angular-app .

# Ejecutar contenedor
docker run -p 4200:80 bank-angular-app
```

## 🧪 Ejecutar Pruebas

```bash
# Pruebas unitarias
ng test

# Pruebas con cobertura
ng test --code-coverage

# Pruebas e2e
ng e2e

# Linting
ng lint
```

### Estructura de Pruebas
```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   └── *.spec.ts
│   ├── features/
│   │   └── **/*.spec.ts
│   └── shared/
│       └── **/*.spec.ts
```

## 🏗️ Arquitectura del Proyecto

```
bank-angular-app/
├── src/
│   ├── app/
│   │   ├── core/                    # Servicios singleton
│   │   │   ├── guards/              # Guardas de rutas
│   │   │   ├── interceptors/        # HTTP Interceptors
│   │   │   │   ├── error.interceptor.ts
│   │   │   │   ├── loading.interceptor.ts
│   │   │   │   ├── cache.interceptor.ts
│   │   │   │   └── logging.interceptor.ts
│   │   │   ├── models/              # Interfaces y tipos
│   │   │   │   ├── cliente.model.ts
│   │   │   │   ├── cuenta.model.ts
│   │   │   │   └── movimiento.model.ts
│   │   │   └── services/            # Servicios de datos
│   │   │       ├── api.service.ts
│   │   │       ├── client.service.ts
│   │   │       ├── account.service.ts
│   │   │       └── movement.service.ts
│   │   ├── features/                # Módulos de funcionalidad
│   │   │   ├── dashboard/           # Dashboard principal
│   │   │   ├── clients/             # Gestión de clientes
│   │   │   │   ├── components/
│   │   │   │   │   ├── client-list/
│   │   │   │   │   ├── client-form/
│   │   │   │   │   └── client-detail/
│   │   │   │   ├── clients.module.ts
│   │   │   │   └── clients-routing.module.ts
│   │   │   ├── accounts/            # Gestión de cuentas
│   │   │   ├── movements/           # Gestión de movimientos
│   │   │   └── reports/             # Módulo de reportes
│   │   ├── layout/                  # Componentes de layout
│   │   │   ├── header/
│   │   │   ├── sidebar/
│   │   │   ├── footer/
│   │   │   └── main/
│   │   ├── shared/                  # Componentes compartidos
│   │   │   ├── components/
│   │   │   ├── pipes/
│   │   │   └── validators/
│   │   ├── app-routing.module.ts    # Rutas principales
│   │   ├── app.component.ts         # Componente raíz
│   │   └── app.module.ts            # Módulo principal
│   ├── assets/                      # Recursos estáticos
│   ├── environments/                # Configuraciones
│   └── styles/                      # Estilos globales
├── docker-compose.yml               # Docker Compose
├── Dockerfile                       # Configuración Docker
├── angular.json                     # Configuración Angular CLI
├── package.json                     # Dependencias npm
└── README.md                        # Este archivo
```

## 📱 Funcionalidades

### 🏠 Dashboard
- **Estadísticas en tiempo real** de clientes, cuentas, movimientos
- **Gráficos y métricas** del sistema bancario
- **Acciones rápidas** para navegación
- **Estado del sistema** con indicadores

### 👥 Gestión de Clientes
- **Lista con paginación** y búsqueda avanzada
- **Filtros múltiples** por estado, género
- **CRUD completo** con validaciones
- **Vista detallada** con historial

### 🏦 Gestión de Cuentas
- **Visualización por cliente** con saldos actuales
- **Tipos de cuenta** (Ahorro/Corriente) con iconografía
- **Búsqueda por número** de cuenta o cliente
- **Estadísticas por cuenta** con movimientos

### 💰 Gestión de Movimientos
- **Lista cronológica** con filtros por fecha
- **Filtros por tipo** (Crédito/Débito), cuenta, cliente
- **Cálculos automáticos** de balances
- **Validaciones de negocio** (saldo, límites)

### 📊 Reportes
- **Generador de reportes** por cliente y período
- **Exportación PDF** con formato profesional
- **Exportación JSON** para integración
- **Vista previa** antes de descargar
- **Reportes rápidos** (diario, semanal, mensual)

## 🎨 Diseño y UX

### Paleta de Colores
```css
:root {
  --primary-blue: #007bff;
  --success-green: #28a745;
  --danger-red: #dc3545;
  --warning-yellow: #ffc107;
  --info-cyan: #17a2b8;
  --light-gray: #f8f9fa;
  --dark-gray: #495057;
}
```

### Componentes de Diseño
- **Cards con sombras** y hover effects
- **Tablas responsive** con sorting y paginación
- **Formularios reactivos** con validación en tiempo real
- **Modales confirmación** para acciones críticas
- **Notificaciones toast** con auto-dismiss
- **Loading spinners** para operaciones asíncronas

### Responsive Design
- **Breakpoints**: 480px, 768px, 1024px, 1200px
- **Mobile-first** approach
- **Grid layouts** flexibles
- **Sidebar colapsable** en mobile

## 🔧 Configuración

### Environment Variables
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5089/api',
  enableLogging: true,
  cacheTimeout: 300000, // 5 minutos
  notificationDuration: 5000 // 5 segundos
};
```

### Angular CLI Configuration
```json
{
  "projects": {
    "bank-angular-app": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

## 🚀 Despliegue

### Build para Producción
```bash
# Build optimizado
ng build --configuration production

# Verificar dist
ls -la dist/bank-angular-app/
```

### Deploy con Docker
```bash
# Build imagen
docker build -t bank-angular-app:latest .

# Deploy
docker run -d -p 80:80 --name bank-frontend bank-angular-app:latest
```

### Deploy con nginx
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5089;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Variables de Entorno de Producción
```bash
NODE_ENV=production
API_URL=https://api.tu-dominio.com
ENABLE_ANALYTICS=true
```

## 📈 Performance

### Optimizaciones Implementadas
- ✅ **Lazy Loading** de módulos
- ✅ **OnPush Change Detection** en componentes críticos
- ✅ **TrackBy functions** en listas
- ✅ **Pipe async** para subscripciones
- ✅ **Service Workers** para caching
- ✅ **Tree shaking** automático

### Métricas de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: < 2MB inicial

## 🔒 Seguridad

### Medidas Implementadas
- ✅ **Sanitización HTML** automática
- ✅ **CSRF Protection** en formularios
- ✅ **Content Security Policy** headers
- ✅ **Validación client-side** + server-side
- ✅ **Error handling** sin exposición de datos sensibles

## 🧪 Testing Strategy

### Tipos de Pruebas
```bash
# Unit Tests
ng test --code-coverage --watch=false

# Integration Tests
ng test --configuration=integration

# E2E Tests
ng e2e --configuration=production
```

### Coverage Goals
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## 📝 Scripts Disponibles

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "test": "ng test",
    "test:coverage": "ng test --code-coverage --watch=false",
    "lint": "ng lint",
    "e2e": "ng e2e",
    "docker:build": "docker build -t bank-angular-app .",
    "docker:run": "docker run -p 4200:80 bank-angular-app"
  }
}
```

## 🤝 Contribución

### Development Workflow
1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Coding Standards
- **TypeScript strict mode** habilitado
- **ESLint + Prettier** configurados
- **Conventional Commits** para mensajes
- **Angular Style Guide** oficial

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Rodrigo Vega**
- GitHub: [@rvegah](https://github.com/rvegah)
- LinkedIn: [Rodrigo Vega Heredia](https://www.linkedin.com/in/rodrigo-vega-heredia/)
- Email: rodrigovegaheredia@gmail.com

---

### 🎯 Ejercicio Técnico - Frontend Angular Completado

Este proyecto demuestra dominio completo de:

- ✅ **Angular Framework** - Arquitectura modular y escalable
- ✅ **TypeScript** - Tipado fuerte y programación orientada a objetos
- ✅ **Reactive Programming** - RxJS y manejo de estado
- ✅ **CSS/SCSS** - Diseño responsivo sin frameworks externos
- ✅ **HTTP Interceptors** - Manejo centralizado de requests
- ✅ **Error Handling** - Gestión global de excepciones
- ✅ **Performance** - Optimizaciones y lazy loading
- ✅ **Testing** - Pruebas unitarias y e2e
- ✅ **Docker** - Containerización para deployment

**Desarrollado como frontend del sistema bancario full-stack, cumpliendo todos los requerimientos del ejercicio técnico.**