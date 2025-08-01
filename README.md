# 🏦 BankAPI - Sistema Bancario Full-Stack

![.NET](https://img.shields.io/badge/.NET-9.0-blue)
![React](https://img.shields.io/badge/React-18.0-61DAFB)
![Angular](https://img.shields.io/badge/Angular-15.0-DD0031)
![Docker](https://img.shields.io/badge/Docker-Enabled-brightgreen)
![Tests](https://img.shields.io/badge/Tests-Passing-success)
![License](https://img.shields.io/badge/License-MIT-yellow)

> **Ejercicio Técnico Full-Stack** - API REST completa para sistema bancario con .NET Core, React y Angular, implementando patrones de diseño, validaciones de negocio y despliegue en Docker.

## 📑 Tabla de Contenidos

- [🎯 Descripción del Proyecto](#-descripción-del-proyecto)
- [⚡ Características Principales](#-características-principales)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📋 Requisitos Previos](#-requisitos-previos)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [🐳 Ejecución con Docker](#-ejecución-con-docker)
- [🧪 Ejecutar Pruebas](#-ejecutar-pruebas)
- [📚 Documentación API](#-documentación-api)
- [🏗️ Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [💼 Casos de Uso](#-casos-de-uso)
- [🔍 Ejemplos de Uso](#-ejemplos-de-uso)
- [📊 Base de Datos](#-base-de-datos)
- [🚀 Despliegue](#-despliegue)
- [👨‍💻 Autor](#-autor)

## 🎯 Descripción del Proyecto

Sistema bancario completo que permite gestionar **clientes**, **cuentas** y **movimientos** financieros con validaciones de negocio robustas. Implementa patrones de diseño profesionales, validaciones automáticas y lógica de negocio compleja como límites diarios y validación de saldos.

### ✨ Funcionalidades Destacadas

- **CRUD Completo** para Clientes, Cuentas y Movimientos
- **Validaciones de Negocio**: Saldo insuficiente, límite diario ($1000)
- **Cálculo Automático** de saldos en tiempo real
- **Reportes** por fecha y cliente con exportación JSON
- **API REST** completamente documentada con Swagger
- **Pruebas Unitarias** con cobertura de casos críticos

### ✨ Frontend Dual
- **React**: Interfaz moderna y responsiva sin librerías externas
- **Angular**: Interfaz alternativa con TypeScript y arquitectura modular
- Gestión completa de todos los módulos (CRUD)
- Dashboard con estadísticas en tiempo real
- Sistema de reportes con múltiples formatos de descarga
- Validaciones en tiempo real con feedback visual
- Arquitectura modular y escalable

## ⚡ Características Principales

### 🔒 Validaciones de Negocio
- ✅ **Saldo Insuficiente**: Previene retiros superiores al saldo disponible
- ✅ **Límite Diario**: Máximo $1000 en débitos por día
- ✅ **Validaciones de Entrada**: Data Annotations en todos los DTOs
- ✅ **Manejo de Errores**: Mensajes descriptivos y códigos HTTP apropiados

### 🏗️ Arquitectura Profesional
- ✅ **Patrón Repository**: Separación de responsabilidades
- ✅ **Dependency Injection**: Inversión de control
- ✅ **DTOs**: Transferencia de datos segura
- ✅ **Entity Framework Core**: ORM con migraciones automáticas

### 🚀 Despliegue y DevOps
- ✅ **Docker**: Containerización completa
- ✅ **SQL Server**: Base de datos relacional
- ✅ **Swagger UI**: Documentación interactiva
- ✅ **Pruebas Automatizadas**: xUnit con Moq

## 🛠️ Tecnologías Utilizadas

### Backend
- **.NET Core 9.0** - Framework principal
- **Entity Framework Core** - ORM
- **SQL Server** - Base de datos
- **Swagger/OpenAPI** - Documentación
- **xUnit + Moq** - Pruebas unitarias

### Frontend React
- **React 18.0** - Framework de UI
- **JavaScript ES6+** - Sin TypeScript para simplicidad
- **CSS3** - Sin frameworks de estilos externos
- **Fetch API** - Para comunicación con backend

### Frontend Angular
- **Angular 15.0** - Framework de UI
- **TypeScript** - Tipado estático
- **Angular CLI** - Herramientas de desarrollo
- **RxJS** - Programación reactiva
- **HTML2Canvas + jsPDF** - Generación de reportes

### DevOps
- **Docker & Docker Compose** - Containerización
- **Git** - Control de versiones

### Patrones y Principios
- **Repository Pattern** - Acceso a datos
- **Dependency Injection** - Inversión de control
- **SOLID Principles** - Diseño orientado a objetos
- **Clean Architecture** - Separación por capas

## 📋 Requisitos Previos

### Para Ejecución Local
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download)
- Node.js 18+ y npm
- [Angular CLI](https://angular.io/cli) (para desarrollo Angular)
- [SQL Server](https://www.microsoft.com/sql-server) o SQL Server Express
- [Visual Studio 2022](https://visualstudio.microsoft.com/) o [VS Code](https://code.visualstudio.com/)

### Para Ejecución con Docker
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- 4GB RAM disponible (recomendado)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/rvegah/FullStackBankApp.git
cd FullStackBankApp
```

### 2. Configurar Base de Datos (Ejecución Local)
```bash
# Navegar al proyecto API
cd BankAPI

# Actualizar cadena de conexión en appsettings.json
# Server=tu-servidor;Database=BankDb;Trusted_Connection=True;

# Aplicar migraciones
dotnet ef database update

# Ejecutar aplicación
dotnet run
```

### 3. Ejecutar Frontend (Desarrollo Local)

#### React
```bash
cd bank-frontend
npm install
npm start
# Disponible en: http://localhost:3000
```

#### Angular
```bash
cd bank-angular-app
npm install
ng serve
# Disponible en: http://localhost:4200
```

### 4. Acceder a la Aplicación
- **API Base**: `http://localhost:5089`
- **Swagger UI**: `http://localhost:5089/swagger`
- **React Frontend**: `http://localhost:3000`
- **Angular Frontend**: `http://localhost:4200`

## 🐳 Ejecución con Docker

### Método Recomendado - Todo el Stack

```bash
# Ejecutar toda la infraestructura (API + React + Angular + SQL Server)
docker-compose up --build

# En segundo plano
docker-compose up --build -d
```

### Servicios Individuales
```bash
# Solo la API y base de datos
docker-compose up bankapi sqlserver --build

# Solo React
docker-compose up bank-frontend --build

# Solo Angular
docker-compose up bank-angular-app --build
```

### Servicios Disponibles
- **API**: `http://localhost:5089`
- **Swagger**: `http://localhost:5089/swagger`
- **React Frontend**: `http://localhost:3000`
- **Angular Frontend**: `http://localhost:4200`
- **SQL Server**: `localhost:1433`

### Comandos Útiles
```bash
# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f bank-angular-app

# Detener servicios
docker-compose down

# Limpiar volúmenes
docker-compose down -v
```

## 🧪 Ejecutar Pruebas

```bash
# Navegar al proyecto de pruebas
cd BankAPI.Tests

# Ejecutar todas las pruebas
dotnet test

# Ejecutar con detalles
dotnet test --logger "console;verbosity=detailed"

# Ejecutar con cobertura
dotnet test --collect:"XPlat Code Coverage"
```

### Pruebas Implementadas
- ✅ **Débito con saldo insuficiente** - Validación de error
- ✅ **Crédito exitoso** - Operación válida
- ✅ **Cupo diario excedido** - Límite de $1000
- ✅ **Cuenta inexistente** - Validación de FK
- ✅ **Valor negativo** - Validación de entrada

## 📚 Documentación API

### Endpoints Principales

#### 👥 Clientes
```http
GET    /api/Cliente           # Obtener todos los clientes
GET    /api/Cliente/{id}      # Obtener cliente por ID
POST   /api/Cliente           # Crear nuevo cliente
PUT    /api/Cliente/{id}      # Actualizar cliente
DELETE /api/Cliente/{id}      # Eliminar cliente
```

#### 🏦 Cuentas
```http
GET    /api/Cuenta                    # Obtener todas las cuentas
GET    /api/Cuenta/{id}               # Obtener cuenta por ID
GET    /api/Cuenta/cliente/{id}       # Cuentas por cliente
POST   /api/Cuenta                    # Crear nueva cuenta
PUT    /api/Cuenta/{id}               # Actualizar cuenta
DELETE /api/Cuenta/{id}               # Eliminar cuenta
```

#### 💰 Movimientos
```http
GET    /api/Movimiento                # Obtener todos los movimientos
GET    /api/Movimiento/{id}           # Obtener movimiento por ID
GET    /api/Movimiento/cuenta/{id}    # Movimientos por cuenta
GET    /api/Movimiento/cliente/{id}   # Movimientos por cliente
POST   /api/Movimiento                # Crear nuevo movimiento
PUT    /api/Movimiento/{id}           # Actualizar movimiento
DELETE /api/Movimiento/{id}           # Eliminar movimiento
```

#### 📊 Reportes
```http
GET /api/Movimiento/reportes?fechaInicio=2025-07-01&fechaFin=2025-07-31&clienteId=1
```

### Swagger UI
La documentación interactiva está disponible en `/swagger` con:
- Esquemas de todos los DTOs
- Ejemplos de requests y responses
- Códigos de error y validaciones
- Posibilidad de probar endpoints directamente

## 🏗️ Arquitectura del Proyecto

```
FullStackBankApp/
├── BankAPI/                     # Proyecto principal de la API
│   ├── Controllers/             # Controladores MVC
│   │   ├── ClienteController.cs
│   │   ├── CuentaController.cs
│   │   └── MovimientoController.cs
│   ├── DTOs/                    # Data Transfer Objects
│   │   ├── ClienteCreateDto.cs
│   │   ├── CuentaCreateDto.cs
│   │   └── MovimientoCreateDto.cs
│   ├── Models/                  # Entidades del dominio
│   │   ├── ApplicationDbContext.cs
│   │   ├── Cliente.cs
│   │   ├── Cuenta.cs
│   │   ├── Movimiento.cs
│   │   └── Persona.cs
│   ├── Repositories/            # Patrón Repository
│   │   ├── IClienteRepository.cs
│   │   ├── ClienteRepository.cs
│   │   └── ...
│   ├── Services/                # Lógica de negocio
│   │   ├── IClienteService.cs
│   │   ├── ClienteService.cs
│   │   └── ...
│   ├── Migrations/              # Migraciones de EF Core
│   ├── Dockerfile               # Configuración Docker
│   ├── Program.cs               # Punto de entrada
│   └── appsettings.json         # Configuración
├── bank-frontend/               # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.js
│   ├── package.json
│   └── Dockerfile
├── bank-angular-app/            # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── models/
│   │   └── environments/
│   ├── package.json
│   └── Dockerfile
├── BankAPI.Tests/               # Proyecto de pruebas
│   └── MovimientoServiceTests.cs
├── docker-compose.yml           # Orquestación Docker
├── BaseDatos.sql               # Script de base de datos
├── BankAPI.postman_collection.json  # Colección Postman
└── README.md                   # Documentación
```

## 💼 Casos de Uso

### Escenario 1: Creación de Cliente y Cuenta
```json
// 1. Crear cliente
POST /api/Cliente
{
  "nombre": "José Lema",
  "genero": "M",
  "edad": 35,
  "identificacion": "12345678",
  "direccion": "Otavalo sn y principal",
  "telefono": "098254785",
  "contrasena": "1234",
  "estado": true
}

// 2. Crear cuenta para el cliente
POST /api/Cuenta
{
  "numeroCuenta": "478758",
  "tipoCuenta": "Ahorro",
  "saldoInicial": 2000,
  "estado": true,
  "clienteId": 1
}
```

### Escenario 2: Operaciones Bancarias
```json
// Depósito exitoso
POST /api/Movimiento
{
  "tipoMovimiento": "Crédito",
  "valor": 600,
  "cuentaId": 1
}

// Retiro exitoso
POST /api/Movimiento
{
  "tipoMovimiento": "Débito",
  "valor": 575,
  "cuentaId": 1
}
```

### Escenario 3: Validaciones de Negocio
```json
// Error: Saldo insuficiente
POST /api/Movimiento
{
  "tipoMovimiento": "Débito",
  "valor": 5000,
  "cuentaId": 1
}
// Response: 400 Bad Request - "Saldo no disponible"

// Error: Cupo diario excedido
POST /api/Movimiento
{
  "tipoMovimiento": "Débito",
  "valor": 1500,
  "cuentaId": 1
}
// Response: 400 Bad Request - "Cupo diario Excedido"
```

## 🔍 Ejemplos de Uso

### Usando cURL

```bash
# Obtener todos los clientes
curl -X GET "http://localhost:5089/api/Cliente" \
     -H "accept: application/json"

# Crear un nuevo cliente
curl -X POST "http://localhost:5089/api/Cliente" \
     -H "accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{
       "nombre": "María García",
       "genero": "F",
       "edad": 28,
       "identificacion": "87654321",
       "direccion": "Av. Principal 123",
       "telefono": "099123456",
       "contrasena": "5678",
       "estado": true
     }'

# Generar reporte de movimientos
curl -X GET "http://localhost:5089/api/Movimiento/reportes?fechaInicio=2025-07-01&fechaFin=2025-07-31&clienteId=1" \
     -H "accept: application/json"
```

### Usando PowerShell

```powershell
# Obtener clientes
Invoke-RestMethod -Uri "http://localhost:5089/api/Cliente" -Method Get

# Crear movimiento
$body = @{
    tipoMovimiento = "Crédito"
    valor = 1000
    cuentaId = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5089/api/Movimiento" -Method Post -Body $body -ContentType "application/json"
```

## 📊 Base de Datos

### Modelo de Datos

```sql
-- Tabla Clientes (hereda de Persona)
CREATE TABLE Clientes (
    ClienteId int IDENTITY(1,1) PRIMARY KEY,
    Nombre nvarchar(100) NOT NULL,
    Genero nvarchar(1) CHECK (Genero IN ('M', 'F')),
    Edad int CHECK (Edad >= 18 AND Edad <= 100),
    Identificacion nvarchar(20) UNIQUE NOT NULL,
    Direccion nvarchar(200) NOT NULL,
    Telefono nvarchar(10) NOT NULL,
    Contrasena nvarchar(50) NOT NULL,
    Estado bit DEFAULT 1
);

-- Tabla Cuentas
CREATE TABLE Cuentas (
    CuentaId int IDENTITY(1,1) PRIMARY KEY,
    NumeroCuenta nvarchar(10) UNIQUE NOT NULL,
    TipoCuenta nvarchar(20) CHECK (TipoCuenta IN ('Ahorro', 'Corriente')),
    SaldoInicial decimal(18,2) CHECK (SaldoInicial >= 0),
    Estado bit DEFAULT 1,
    ClienteId int FOREIGN KEY REFERENCES Clientes(ClienteId)
);

-- Tabla Movimientos
CREATE TABLE Movimientos (
    MovimientoId int IDENTITY(1,1) PRIMARY KEY,
    Fecha datetime2(7) DEFAULT GETDATE(),
    TipoMovimiento nvarchar(20) CHECK (TipoMovimiento IN ('Crédito', 'Débito')),
    Valor decimal(18,2) NOT NULL,
    Saldo decimal(18,2) NOT NULL,
    CuentaId int FOREIGN KEY REFERENCES Cuentas(CuentaId)
);
```

### Script de Datos de Ejemplo

El archivo `BaseDatos.sql` incluye:
- Estructura completa de tablas con constraints
- Datos de ejemplo según casos de uso del ejercicio
- Consultas de verificación y reportes
- Estadísticas del sistema

## 🚀 Despliegue

### Producción con Docker

```bash
# Clonar repositorio
git clone https://github.com/rvegah/FullStackBankApp.git
cd FullStackBankApp

# Configurar variables de entorno de producción
cp docker-compose.yml docker-compose.prod.yml
# Editar docker-compose.prod.yml con configuraciones de producción

# Desplegar
docker-compose -f docker-compose.prod.yml up -d
```

### Variables de Entorno

```bash
# SQL Server
ACCEPT_EULA=Y
SA_PASSWORD=TuPasswordSeguro123!

# API
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection="Server=sqlserver;Database=BankDb;User Id=sa;Password=TuPasswordSeguro123!;TrustServerCertificate=True;"
```

## 📋 Checklist de Entregables

### ✅ Código Fuente
- [x] Proyecto .NET Core completo
- [x] Frontend React funcional
- [x] Frontend Angular funcional
- [x] Patrones Repository y Service implementados
- [x] DTOs con validaciones
- [x] Controladores REST
- [x] Manejo de excepciones

### ✅ Base de Datos
- [x] Script SQL (`BaseDatos.sql`)
- [x] Migraciones Entity Framework
- [x] Datos de ejemplo
- [x] Constraints y relaciones

### ✅ Pruebas
- [x] 5 pruebas unitarias mínimo
- [x] Cobertura de casos críticos
- [x] Pruebas de validación de negocio

### ✅ Docker
- [x] Dockerfile para API
- [x] Dockerfile para React
- [x] Dockerfile para Angular
- [x] docker-compose.yml funcional
- [x] Migraciones automáticas
- [x] SQL Server containerizado

### ✅ Documentación
- [x] README.md completo
- [x] Swagger UI
- [x] Postman Collection
- [x] Ejemplos de uso

### ✅ API REST
- [x] CRUD completo para todas las entidades
- [x] Endpoint de reportes
- [x] Validaciones de negocio
- [x] Manejo de errores HTTP

## 🤝 Contribución

Este es un ejercicio técnico individual, pero las mejoras son bienvenidas:

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Rodrigo Vega**
- GitHub: [@rvegah](https://github.com/rvegah)
- LinkedIn: [Rodrigo Vega Heredia](https://www.linkedin.com/in/rodrigo-vega-heredia/)
- Email: rodrigovegaheredia@gmail.com

---

### 🎯 Ejercicio Técnico Completado

Este proyecto demuestra:
- ✅ Dominio de .NET Core y Entity Framework
- ✅ Desarrollo Frontend con React y Angular
- ✅ Implementación de patrones de diseño
- ✅ Validaciones de negocio complejas
- ✅ Arquitectura escalable y mantenible
- ✅ Despliegue con Docker
- ✅ Pruebas unitarias y documentación

**Desarrollado como parte del ejercicio técnico Full-Stack para demostrar competencias en desarrollo backend, frontend, arquitectura de software y DevOps.**