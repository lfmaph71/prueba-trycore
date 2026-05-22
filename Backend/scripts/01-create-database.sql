-- =========================================================
-- SCRIPT: 01-create-database.sql
-- PROYECTO: EVM - Earned Value Management
-- DESCRIPCIÓN: Creación de la base de datos y tablas para
--              la aplicación de Valor Ganado (EVM)
-- MOTOR: SQL Server
-- =========================================================

-- =========================================================
-- 1. CREACIÓN DE LA BASE DE DATOS
-- =========================================================
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EVM_DB')
BEGIN
    CREATE DATABASE EVM_DB;
END
GO

USE EVM_DB;
GO

-- =========================================================
-- 2. TABLA: Projects
--    Almacena los proyectos del portafolio
-- =========================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Projects]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Projects] (
        [Id]            INT             IDENTITY(1,1)   NOT NULL,
        [Name]          NVARCHAR(200)   NOT NULL,
        [Description]   NVARCHAR(1000)  NULL,
        [CreatedAt]     DATETIME2       NOT NULL        DEFAULT GETUTCDATE(),
        [UpdatedAt]     DATETIME2       NOT NULL        DEFAULT GETUTCDATE(),

        CONSTRAINT [PK_Projects] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [UQ_Projects_Name] UNIQUE ([Name])
    );
END
GO

-- =========================================================
-- 3. TABLA: Activities
--    Almacena las actividades de cada proyecto con los
--    datos necesarios para el calculo de Valor Ganado
-- =========================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Activities]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Activities] (
        [Id]                INT             IDENTITY(1,1)   NOT NULL,
        [ProjectId]         INT             NOT NULL,
        [Name]              NVARCHAR(200)   NOT NULL,
        [Bac]               DECIMAL(18, 2)  NOT NULL        DEFAULT 0,
        [PlannedPercent]    DECIMAL(5, 2)   NOT NULL        DEFAULT 0,
        [ActualPercent]     DECIMAL(5, 2)   NOT NULL        DEFAULT 0,
        [ActualCost]        DECIMAL(18, 2)  NOT NULL        DEFAULT 0,
        [CreatedAt]         DATETIME2       NOT NULL        DEFAULT GETUTCDATE(),
        [UpdatedAt]         DATETIME2       NOT NULL        DEFAULT GETUTCDATE(),

        CONSTRAINT [PK_Activities] PRIMARY KEY CLUSTERED ([Id] ASC),

        CONSTRAINT [FK_Activities_Projects_ProjectId]
            FOREIGN KEY ([ProjectId])
            REFERENCES [dbo].[Projects] ([Id])
            ON DELETE CASCADE,

        CONSTRAINT [CHK_Activities_Bac]
            CHECK ([Bac] >= 0),

        CONSTRAINT [CHK_Activities_PlannedPercent]
            CHECK ([PlannedPercent] >= 0 AND [PlannedPercent] <= 100),

        CONSTRAINT [CHK_Activities_ActualPercent]
            CHECK ([ActualPercent] >= 0 AND [ActualPercent] <= 100),

        CONSTRAINT [CHK_Activities_ActualCost]
            CHECK ([ActualCost] >= 0)
    );
END
GO

-- =========================================================
-- 4. INDICES
-- =========================================================

-- Indice para búsquedas rápidas de actividades por proyecto
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Activities_ProjectId')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Activities_ProjectId]
        ON [dbo].[Activities] ([ProjectId] ASC)
        INCLUDE ([Name], [Bac], [PlannedPercent], [ActualPercent], [ActualCost]);
END
GO

-- Indice para ordenar actividades por nombre dentro de un proyecto
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Activities_ProjectId_Name')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Activities_ProjectId_Name]
        ON [dbo].[Activities] ([ProjectId] ASC, [Name] ASC);
END
GO

PRINT 'Base de datos EVM_DB creada/verificada exitosamente.';
GO