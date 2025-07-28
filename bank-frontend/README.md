# 🏦 BankAPI - Sistema Bancario Full-Stack

[![.NET](https://img.shields.io/badge/.NET-9.0-blue.svg)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-brightgreen.svg)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)](https://github.com/rvegah/FullStackBankApp)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Ejercicio Técnico Full-Stack - Sistema bancario completo con API REST en .NET Core y frontend en React, implementando patrones de diseño, validaciones de negocio y despliegue en Docker.

## 🎯 Descripción del Proyecto

Sistema bancario completo que permite gestionar clientes, cuentas y movimientos financieros con validaciones de negocio robustas. Implementa patrones de diseño profesionales, validaciones automáticas y lógica de negocio compleja como límites diarios y validación de saldos.

### ✨ Funcionalidades Destacadas

**Backend (.NET Core):**
- CRUD Completo para Clientes, Cuentas y Movimientos
- Validaciones de Negocio: Saldo insuficiente, límite diario ($1000)
- Cálculo Automático de saldos en tiempo real
- Reportes por fecha y cliente con exportación JSON
- API REST completamente documentada con Swagger
- Pruebas Unitarias con cobertura de casos críticos

**Frontend (React):**
- Interfaz moderna y responsiva sin librerías externas
- Gestión completa de todos los módulos (CRUD)
- Dashboard con estadísticas en tiempo real
- Sistema de reportes con múltiples formatos de descarga
- Validaciones en tiempo real con feedback visual
- Arquitectura modular y escalable

## 🛠️ Tecnologías Utilizadas

### Backend
- .NET Core 9.0 - Framework principal
- Entity Framework Core - ORM
- SQL Server - Base de datos
- Swagger/OpenAPI - Documentación
- xUnit + Moq - Pruebas unitarias

### Frontend
- React 18.0 - Framework de UI
- JavaScript ES6+ - Sin TypeScript para simplicidad
- CSS3 - Sin frameworks de estilos externos
- Fetch API - Para comunicación con backend

### DevOps
- Docker & Docker Compose - Containerización
- Git - Control de versiones

### Patrones y Principios
- Repository Pattern - Acceso a datos
- Dependency Injection - Inversión de control
- SOLID Principles - Diseño orientado a objetos
- Clean Architecture - Separación por capas
- Component-based Architecture - Frontend modular

## 🚀 Estructura del Proyecto