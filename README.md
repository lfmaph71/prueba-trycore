Resumen general del Backend.

•	Proyecto: API Web (.NET 8) para Earned Value Management (EVM).
•	Componentes principales:
•	Program.cs — arranque, DI y configuración.
•	Controllers — ProjectsController, ActivitiesController (endpoints REST).
•	Services — ProjectService, ActivityService, EvmCalculationService (lógica de negocio).
•	Data\AppDbContext.cs — EF Core y mapeo de entidades.
•	Middleware\ExceptionHandlingMiddleware.cs — gestión centralizada de errores.
•	Validators\CreateProjectValidator.cs — validaciones con FluentValidation.
•	DTOs y entidades en Models\DTOs y Models\Entities.

Como ejcutar el progrma: (qué hace Program.cs)
* Ejecutar el sqcript para crear la DB con sus respectivas tablas que se encuentra en las carpetas script.
* Configurar en el appsetting.json la cadena de conexion de la DB, en el item DefaultConnection.
* Abrir el proyecto en VS Code o Visual Studio y ejecutarlo.
* El swagger se mostrara en una ventana de su navegador donde se encuentra toda la documentacio y descripcion de la API, ademas podra testear sus diferentes endpoint.
  
Modelo de datos (AppDbContext.cs)
•	Projects:
•	Id, Name (único, max 200), Description (max 1000), timestamps, colección Activities.
•	Activities:
•	Id, ProjectId (FK), Name, Bac, PlannedPercent, ActualPercent, ActualCost, timestamps.
•	Eliminación en cascada al borrar proyecto.

Endpoints principales
•	ProjectsController (/api/projects)
•	GET /api/projects — todos los proyectos con resumen EVM consolidado.
•	GET /api/projects/{id} — proyecto por id.
•	POST /api/projects — crear proyecto (validado).
•	PUT /api/projects/{id} — actualizar proyecto.
•	DELETE /api/projects/{id} — borrar proyecto y actividades.

•	ActivitiesController
•	GET /api/projects/{projectId}/activities — actividades de un proyecto (con indicadores).
•	GET /api/activities/{id} — actividad por id.
•	POST /api/projects/{projectId}/activities — crear actividad (verifica existencia del proyecto).
•	PUT /api/activities/{id} — actualizar actividad.
•	DELETE /api/activities/{id} — borrar actividad.

Lógica EVM (EvmCalculationService)
•	Cálculos por actividad:
•	PV = (PlannedPercent / 100) * BAC
•	EV = (ActualPercent / 100) * BAC
•	CV = EV - AC
•	SV = EV - PV
•	CPI = EV / AC (manejo especial si AC == 0)
•	SPI = EV / PV (manejo especial si PV == 0)
•	EAC = BAC / CPI (manejo para CPI == 0 o CPI extremadamente grande)
•	VAC = BAC - EAC
•	Interpretaciones de CPI/SPI (on/under/over budget; on/ahead/behind schedule)
•	CalculateConsolidated agrega PV, EV, AC de actividades y calcula indicadores consolidados.
•	Resultados redondeados a 2 decimales.

Servicios (ProjectService, ActivityService)
•	CRUD con AppDbContext.
•	Mapean entidades a DTOs.
•	Llaman a IEvmCalculationService para llenar indicadores de cada actividad.
•	ProjectService consolida indicadores de actividades para el resumen del proyecto.

Flujo típico (ejemplos)
•	Crear proyecto: POST /api/projects -> ProjectService.CreateAsync -> guarda en BD -> 201 Created.
•	Añadir actividad: POST /api/projects/{id}/activities -> verifica proyecto -> guarda actividad -> devuelve ActivityDto con Indicators.
•	Obtener proyecto con EVM: GET /api/projects/{id} -> carga proyecto + actividades -> calcula indicadores por actividad -> consolida indicadores -> devuelve ProjectDto con EvmSummary.

Detalles adicionales
•	Swagger UI disponible en /swagger-ui.
•	CORS habilitado para frontend Angular en http://localhost:4200.
•	En desarrollo se usa EnsureCreated() en vez de migraciones.
•	Program es partial y público para facilitar pruebas de integración.

Resumen general del Frontend:



