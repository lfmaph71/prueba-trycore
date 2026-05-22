-- =========================================================
-- SCRIPT: 02-insert-sample-data.sql
-- PROYECTO: EVM - Earned Value Management
-- DESCRIPCIÓN: Datos de ejemplo para probar la API
-- MOTOR: SQL Server
-- =========================================================

USE EVM_DB;
GO

-- =========================================================
-- 1. LIMPIAR DATOS EXISTENTES (opcional, para reiniciar)
-- =========================================================
DELETE FROM [dbo].[Activities];
DELETE FROM [dbo].[Projects];
GO

-- =========================================================
-- 2. INSERTAR PROYECTOS
-- =========================================================

-- Proyecto 1: Desarrollo de plataforma e-commerce
INSERT INTO [dbo].[Projects] ([Name], [Description], [CreatedAt], [UpdatedAt])
VALUES (
    'Desarrollo Plataforma E-Commerce',
    'Proyecto para construir una tienda en línea con catálogo de productos, carrito de compras y pasarela de pagos.',
    GETUTCDATE(),
    GETUTCDATE()
);
GO

-- Proyecto 2: Migración a la nube
INSERT INTO [dbo].[Projects] ([Name], [Description], [CreatedAt], [UpdatedAt])
VALUES (
    'Migración Infraestructura a la Nube',
    'Migración de servidores on-premise a AWS, incluyendo bases de datos, aplicaciones y almacenamiento.',
    GETUTCDATE(),
    GETUTCDATE()
);
GO

-- Proyecto 3: Aplicación móvil de delivery
INSERT INTO [dbo].[Projects] ([Name], [Description], [CreatedAt], [UpdatedAt])
VALUES (
    'App Móvil de Delivery',
    'Aplicación mobile para pedidos de comida a domicilio con seguimiento en tiempo real.',
    GETUTCDATE(),
    GETUTCDATE()
);
GO

-- =========================================================
-- 3. INSERTAR ACTIVIDADES POR PROYECTO
-- =========================================================

-- ==============================
-- PROYECTO 1: E-Commerce
-- BAC total: $150,000
-- ==============================

-- Actividad 1.1: Diseño UX/UI (BAC: $20,000)
-- Estado: Adelantado y dentro del presupuesto ✅
-- % Planificado: 100% (ya debería estar terminado)
-- % Completado: 100% (está terminado)
-- Costo real: $18,000 (gastó menos de lo planeado)
INSERT INTO [dbo].[Activities] ([ProjectId], [Name], [Bac], [PlannedPercent], [ActualPercent], [ActualCost], [CreatedAt], [UpdatedAt])
VALUES (1, 'Diseño UX/UI', 20000.00, 100.00, 100.00, 18000.00, GETUTCDATE(), GETUTCDATE());
GO

-- Actividad 1.2: Desarrollo Backend (BAC: $50,000)
-- Estado: Atrasado y sobre presupuesto 🔴
-- % Planificado: 80% (debería estar al 80%)
-- % Completado: 60% (solo lleva el 60%)
-- Costo real: $45,000 (ya gastó $45k de $50k presupuestados)
INSERT INTO [dbo].[Activities] ([ProjectId], [Name], [Bac], [PlannedPercent], [ActualPercent], [ActualCost], [CreatedAt], [UpdatedAt])
VALUES (1, 'Desarrollo Backend', 50000.00, 80.00, 60.00, 45000.00, GETUTCDATE(), GETUTCDATE());
GO

-- Actividad 1.3: Desarrollo Frontend (BAC: $40,000)
-- Estado: En tiempo y presupuesto 🟢
-- % Planificado: 70%
-- % Completado: 70%
-- Costo real: $28,000
INSERT INTO [dbo].[Activities] ([ProjectId], [Name], [Bac], [PlannedPercent], [ActualPercent], [ActualCost], [CreatedAt], [UpdatedAt])
VALUES (1, 'Desarrollo Frontend', 40000.00, 70.00, 70.00, 28000.00, GETUTCDATE(), GETUTCDATE());
GO

-- Actividad 1.4: Integración pasarela de pagos (BAC: $25,000)
-- Estado: Apenas comenzada 🟡 (alerta)
-- % Planificado: 40%
-- % Completado: 25%
-- Costo real: $18,000 (ya gastó mucho para tan poco avance)
INSERT INTO [dbo].[Activities] ([ProjectId], [Name], [Bac], [PlannedPercent], [ActualPercent], [ActualCost], [CreatedAt], [UpdatedAt])
VALUES (1, 'Integración Pasarela de Pagos', 25000.00, 40.00, 25.00, 18000.00, GETUTCDATE(), GETUTCDATE());
GO

-- Actividad 1.5: Pruebas QA (BAC: $15,000)
-- Estado: No ha comenzado
-- % Planificado: 10%
-- % Completado: 0%
-- Costo real: $0
INSERT INTO [dbo].[Activities] ([ProjectId], [Name], [Bac], [PlannedPercent], [ActualPercent], [ActualCost], [CreatedAt], [UpdatedAt])
VALUES (1, 'Pruebas de Calidad QA', 15000.00, 10.00, 0.00, 0.00, GETUTCDATE(), GETUTCDATE());
GO

-- ==============================
-- PROYECTO 2: Migración a la nube
-- BAC total: $90,000
-- ==============================

INSERT INTO [dbo].[Activities] ([ProjectId], [Name], [Bac], [PlannedPercent], [ActualPercent], [ActualCost], [CreatedAt], [UpdatedAt])
VALUES (2, 'Evaluación y Planificación', 10000.00, 100.00, 100.00, 9500.00, GETUTCDATE(), GETUTCDATE());
GO

INSERT INTO [dbo].[Activities] ([ProjectId], [Name], [Bac], [PlannedPercent], [ActualPercent], [ActualCost], [CreatedAt], [UpdatedAt])
VALUES (2, 'Migración Bases de Datos', 30000.00, 60.00, 65.00, 18000.00, GETUTCDATE(), GETUTCDATE());
GO

INSERT INTO [dbo].[Activities] ([ProjectId], [Name], [Bac], [PlannedPercent], [ActualPercent], [ActualCost], [CreatedAt], [UpdatedAt])
VALUES (2, 'Migración Aplicaciones', 35000.00, 30.00, 30.00, 10000.00, GETUTCDATE(), GETUTCDATE());
GO

INSERT INTO [dbo].[Activities] ([ProjectId], [Name], [Bac], [PlannedPercent], [ActualPercent], [ActualCost], [CreatedAt], [UpdatedAt])
VALUES (2, 'Migración Almacenamiento', 15000.00, 50.00, 45.00, 8000.00, GETUTCDATE(), GETUTCDATE());
GO

-- ==============================
-- PROYECTO 3: App Delivery
-- BAC total: $75,000 (sin actividades aún para probar el caso de proyecto vacío)
-- ==============================

-- Este proyecto se deja sin actividades para probar el caso borde

-- =========================================================
-- 4. VERIFICAR DATOS INSERTADOS
-- =========================================================
PRINT '==========================================';
PRINT 'DATOS DE EJEMPLO INSERTADOS CORRECTAMENTE';
PRINT '==========================================';

SELECT 'Proyectos:' AS [Info], COUNT(*) AS [Total] FROM [dbo].[Projects]
UNION ALL
SELECT 'Actividades:', COUNT(*) FROM [dbo].[Activities];
GO

SELECT 
    p.Name AS [Proyecto],
    a.Name AS [Actividad],
    a.Bac AS [Presupuesto (BAC)],
    a.PlannedPercent AS [% Planificado],
    a.ActualPercent AS [% Completado],
    a.ActualCost AS [Costo Real (AC)]
FROM [dbo].[Projects] p
LEFT JOIN [dbo].[Activities] a ON a.ProjectId = p.Id
ORDER BY p.Name, a.Name;
GO