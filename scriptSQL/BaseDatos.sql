-- =============================================
-- Script: BaseDatos.sql
-- Descripción: Script para crear la base de datos BankDb
-- con estructura y datos de ejemplo según el ejercicio técnico
-- =============================================

USE master;
GO

-- Crear base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'BankDb')
BEGIN
    CREATE DATABASE BankDb;
END
GO

USE BankDb;
GO

-- =============================================
-- CREACIÓN DE TABLAS
-- =============================================

-- Tabla Clientes (hereda estructura de Persona)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Clientes' AND xtype='U')
BEGIN
    CREATE TABLE Clientes (
        ClienteId int IDENTITY(1,1) NOT NULL,
        PersonaId int NOT NULL DEFAULT 0,
        Nombre nvarchar(100) NOT NULL,
        Genero nvarchar(1) NOT NULL CHECK (Genero IN ('M', 'F')),
        Edad int NOT NULL CHECK (Edad >= 18 AND Edad <= 100),
        Identificacion nvarchar(20) NOT NULL,
        Direccion nvarchar(200) NOT NULL,
        Telefono nvarchar(10) NOT NULL,
        Contrasena nvarchar(50) NOT NULL,
        Estado bit NOT NULL DEFAULT 1,
        CONSTRAINT PK_Clientes PRIMARY KEY (ClienteId),
        CONSTRAINT UK_Clientes_Identificacion UNIQUE (Identificacion)
    );
END
GO

-- Tabla Cuentas
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Cuentas' AND xtype='U')
BEGIN
    CREATE TABLE Cuentas (
        CuentaId int IDENTITY(1,1) NOT NULL,
        NumeroCuenta nvarchar(10) NOT NULL,
        TipoCuenta nvarchar(20) NOT NULL CHECK (TipoCuenta IN ('Ahorro', 'Corriente')),
        SaldoInicial decimal(18,2) NOT NULL CHECK (SaldoInicial >= 0),
        Estado bit NOT NULL DEFAULT 1,
        ClienteId int NOT NULL,
        CONSTRAINT PK_Cuentas PRIMARY KEY (CuentaId),
        CONSTRAINT UK_Cuentas_NumeroCuenta UNIQUE (NumeroCuenta),
        CONSTRAINT FK_Cuentas_Clientes FOREIGN KEY (ClienteId) REFERENCES Clientes(ClienteId)
    );
END
GO

-- Tabla Movimientos
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Movimientos' AND xtype='U')
BEGIN
    CREATE TABLE Movimientos (
        MovimientoId int IDENTITY(1,1) NOT NULL,
        Fecha datetime2(7) NOT NULL DEFAULT GETDATE(),
        TipoMovimiento nvarchar(20) NOT NULL CHECK (TipoMovimiento IN ('Crédito', 'Débito')),
        Valor decimal(18,2) NOT NULL,
        Saldo decimal(18,2) NOT NULL,
        CuentaId int NOT NULL,
        CONSTRAINT PK_Movimientos PRIMARY KEY (MovimientoId),
        CONSTRAINT FK_Movimientos_Cuentas FOREIGN KEY (CuentaId) REFERENCES Cuentas(CuentaId)
    );
END
GO

-- =============================================
-- INSERCIÓN DE DATOS DE EJEMPLO
-- =============================================

-- Limpiar datos existentes (orden importante por FK)
DELETE FROM Movimientos;
DELETE FROM Cuentas;
DELETE FROM Clientes;

-- Reiniciar IDENTITY solo si hay datos
IF EXISTS (SELECT 1 FROM Movimientos)
    DBCC CHECKIDENT ('Movimientos', RESEED, 0);
IF EXISTS (SELECT 1 FROM Cuentas)
    DBCC CHECKIDENT ('Cuentas', RESEED, 0);
IF EXISTS (SELECT 1 FROM Clientes)
    DBCC CHECKIDENT ('Clientes', RESEED, 0);
GO

-- =============================================
-- 1. INSERTAR CLIENTES (según casos de uso del ejercicio)
-- =============================================
INSERT INTO Clientes (PersonaId, Nombre, Genero, Edad, Identificacion, Direccion, Telefono, Contrasena, Estado)
VALUES 
    (1, 'José Lema', 'M', 35, '12345678', 'Otavalo sn y principal', '098254785', '1234', 1),
    (2, 'Marianela Montalvo', 'F', 28, '87654321', 'Amazonas y NNUU', '097548965', '5678', 1),
    (3, 'Juan Osorio', 'M', 42, '11223344', '13 junio y Equinoccial', '098874587', '1245', 1);
GO

-- =============================================
-- 2. INSERTAR CUENTAS (según casos de uso del ejercicio)
-- =============================================
-- NOTA: Usar los ClienteId generados automáticamente (1, 2, 3)
INSERT INTO Cuentas (NumeroCuenta, TipoCuenta, SaldoInicial, Estado, ClienteId)
VALUES 
    -- Cuentas para José Lema (ClienteId = 1)
    ('478758', 'Ahorro', 2000.00, 1, 1),
    ('585545', 'Corriente', 1000.00, 1, 1),
    
    -- Cuentas para Marianela Montalvo (ClienteId = 2)
    ('225487', 'Corriente', 100.00, 1, 2),
    ('496825', 'Ahorro', 540.00, 1, 2),
    
    -- Cuenta para Juan Osorio (ClienteId = 3)
    ('495878', 'Ahorro', 0.00, 1, 3);
GO

-- =============================================
-- 3. INSERTAR MOVIMIENTOS (según casos de uso del ejercicio)
-- =============================================
-- NOTA: Usar los CuentaId generados automáticamente (1, 2, 3, 4, 5)

-- Movimientos para José Lema - Cuenta 478758 (CuentaId = 1)
INSERT INTO Movimientos (Fecha, TipoMovimiento, Valor, Saldo, CuentaId)
VALUES 
    ('2025-07-25 10:00:00', 'Débito', -575.00, 1425.00, 1); -- Retiro de 575

-- Movimientos para Marianela Montalvo - Cuenta 225487 (CuentaId = 3)  
INSERT INTO Movimientos (Fecha, TipoMovimiento, Valor, Saldo, CuentaId)
VALUES 
    ('2025-07-25 11:00:00', 'Crédito', 600.00, 700.00, 3); -- Depósito de 600

-- Movimientos para Juan Osorio - Cuenta 495878 (CuentaId = 5)
INSERT INTO Movimientos (Fecha, TipoMovimiento, Valor, Saldo, CuentaId)
VALUES 
    ('2025-07-25 12:00:00', 'Crédito', 150.00, 150.00, 5); -- Depósito de 150

-- Movimientos para Marianela Montalvo - Cuenta 496825 (CuentaId = 4)
INSERT INTO Movimientos (Fecha, TipoMovimiento, Valor, Saldo, CuentaId)
VALUES 
    ('2025-07-25 13:00:00', 'Débito', -540.00, 0.00, 4); -- Retiro de 540

GO

-- =============================================
-- 4. CONSULTAS DE VERIFICACIÓN
-- =============================================

-- Verificar clientes
SELECT 'CLIENTES CREADOS:' AS Resultado;
SELECT ClienteId, Nombre, Genero, Edad, Identificacion, Direccion, Telefono, Estado 
FROM Clientes;

-- Verificar cuentas con información del cliente
SELECT 'CUENTAS CREADAS:' AS Resultado;
SELECT 
    c.CuentaId,
    c.NumeroCuenta,
    c.TipoCuenta,
    c.SaldoInicial,
    c.Estado,
    cl.Nombre AS Cliente
FROM Cuentas c
INNER JOIN Clientes cl ON c.ClienteId = cl.ClienteId;

-- Verificar movimientos con información completa
SELECT 'MOVIMIENTOS CREADOS:' AS Resultado;
SELECT 
    m.MovimientoId,
    m.Fecha,
    m.TipoMovimiento,
    m.Valor,
    m.Saldo,
    c.NumeroCuenta,
    c.TipoCuenta,
    cl.Nombre AS Cliente
FROM Movimientos m
INNER JOIN Cuentas c ON m.CuentaId = c.CuentaId
INNER JOIN Clientes cl ON c.ClienteId = cl.ClienteId
ORDER BY m.Fecha;

-- =============================================
-- 5. REPORTE DE ESTADO DE CUENTA (Ejemplo)
-- =============================================
SELECT 'REPORTE ESTADO DE CUENTA - MARIANELA MONTALVO:' AS Resultado;

SELECT 
    FORMAT(m.Fecha, 'dd/MM/yyyy') AS Fecha,
    cl.Nombre AS Cliente,
    c.NumeroCuenta AS [Numero Cuenta],
    c.TipoCuenta AS Tipo,
    c.SaldoInicial AS [Saldo Inicial],
    CASE WHEN c.Estado = 1 THEN 'True' ELSE 'False' END AS Estado,
    m.Valor AS Movimiento,
    m.Saldo AS [Saldo Disponible]
FROM Movimientos m
INNER JOIN Cuentas c ON m.CuentaId = c.CuentaId
INNER JOIN Clientes cl ON c.ClienteId = cl.ClienteId
WHERE cl.Nombre = 'Marianela Montalvo'
    AND m.Fecha >= '2025-07-25'
    AND m.Fecha < '2025-07-26'
ORDER BY m.Fecha DESC;

-- =============================================
-- 6. ESTADÍSTICAS FINALES
-- =============================================
SELECT 'ESTADÍSTICAS DE LA BASE DE DATOS:' AS Resultado;
SELECT 
    (SELECT COUNT(*) FROM Clientes) AS TotalClientes,
    (SELECT COUNT(*) FROM Cuentas) AS TotalCuentas,
    (SELECT COUNT(*) FROM Movimientos) AS TotalMovimientos,
    (SELECT SUM(Saldo) FROM (
        SELECT DISTINCT c.CuentaId, 
               ISNULL((SELECT TOP 1 m.Saldo 
                      FROM Movimientos m 
                      WHERE m.CuentaId = c.CuentaId 
                      ORDER BY m.Fecha DESC), c.SaldoInicial) AS Saldo
        FROM Cuentas c
    ) AS SaldosActuales) AS SaldoTotalSistema;

-- =============================================
-- SCRIPT COMPLETADO EXITOSAMENTE
-- =============================================
PRINT 'Base de datos BankDb creada y poblada exitosamente con datos de ejemplo.';
PRINT 'Incluye 3 clientes, 5 cuentas y 4 movimientos según casos de uso del ejercicio.';
GO