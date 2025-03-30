# gestion_facturas_dotnet_react - Prueba Técnica
---

## Tecnologías utilizadas

- **Frontend**: React + Bootstrap
- **Backend**: .NET Core 8 + Entity Framework Core
- **Base de datos**: SQL Server (localdb)
- **Autenticación**: JWT
- **Documentación**: Swagger UI

---

## Funcionalidades implementadas

### Gestión de facturas
- Importación de facturas desde JSON.
- Listado de facturas con filtros por número, estado y estado de pago.
- Visualización del **saldo pendiente** por factura.
- Visualización de notas de crédito aplicadas (modal).
- Paginación con selector de cantidad por página.

### Gestión de notas de crédito (NC)
- Agregar NC a una factura con fecha de creación automática.
- Validación para evitar agregar NC a facturas canceladas.
- Validación del monto: no puede superar el saldo pendiente.
- Visualización de todas las notas de crédito existentes con paginación.
- Orden descendente por fecha.

---

## Patrón de diseño utilizado

**Patrón: Separación en Capas (Layered Architecture)**

Este patrón permite separar responsabilidades en distintas capas para lograr un código más limpio, mantenible y testable.

### Capas aplicadas en este proyecto:

1. **WebApi**: Entrada de peticiones HTTP (controladores).
2. **Application**: Lógica de negocio (servicios y validaciones).
3. **Infrastructure**: Acceso a datos (repositorios y EF Core).
4. **Domain/DTOs**: Modelos de transferencia de datos.

### ¿Por qué se utilizó?

- Permite escalar el proyecto fácilmente.
- Mejora la legibilidad y mantenibilidad.
- Facilita pruebas unitarias y desacopla la lógica de negocio del acceso a datos.

---

## Instalación
1. **Clonar el repositorio**
```
git clone https://github.com/tu-usuario/gestion-facturas-dotnet-react.git
cd gestion-facturas-dotnet-react
```
2. **Ejecutar backend**
- 2.1. **Ingresar al proyecto WebApi**
```
cd src/GestionFacturas.WebApi
```
- 2.2. **Restaurar paquetes**
```
dotnet restore
```
- 2.3. **Crear la base de datos mediante migraciones**
```
dotnet ef database update
```
- 2.4. **Ejecutar la API**
```
dotnet run
```

La API estará disponible en:
```
https://localhost:5144/api
```

Puedes probar los endpoints en:
```
https://localhost:5144/swagger
```

## Credenciales de prueba

```txt
Usuario: "admin"
Contraseña: "1234" (Texto, NO numerico)
```
- Una vez se inicia sesión, copiar el Token devuelto en la respuesta (Response body)
- hacer click en "Authorize" en la esquina superior derecha de Swagger
- en Value poner: Bearer *Token* 

---

3. **Ejecutar Frontend**
   **Abrir otra terminal y mantener abierta la ventana de backend**
- 3.1. **Volver a la raíz y entrar al frontend**
```
cd ../../facturas-frontend
```
- 3.2. **Instalar dependencias**
```
npm install
```
- 3.3. **Configurar el archivo .env**
Crea un archivo .env en la carpeta facturas-frontend con este contenido:
```
REACT_APP_API_URL=https://localhost:5144/api
```
- 3.4. **Levantar la aplicación React**
```
npm start
```

La app abrirá automáticamente en:
http://localhost:3000

