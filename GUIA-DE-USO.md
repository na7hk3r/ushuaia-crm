# 🏔️ Ushuaia CRM — Guía de Uso

Bienvenido/a a **Ushuaia CRM**, el programa de gestión para tu negocio de alfajores. Acá vas a encontrar todo lo que necesitás saber para empezar a usarlo.

---

## 📂 ¿Cómo instalar el programa?

1. Hacé doble clic en el archivo **Ushuaia CRM Setup 1.0.0.exe**.
2. Windows puede mostrar un aviso de seguridad. Hacé clic en **"Más información"** y luego en **"Ejecutar de todas formas"**. Es normal porque el programa no tiene firma digital.
3. Se abrirá el asistente de instalación. Seguí los pasos:
   - Elegí la carpeta donde querés instalar el programa (o dejá la que viene por defecto).
   - Hacé clic en **"Instalar"**.
4. Esperá a que termine la instalación.
5. ¡Listo! Se creará un acceso directo en el **escritorio** y en el **menú Inicio**.

### Abrir el programa
- Hacé doble clic en el acceso directo **Ushuaia CRM** en el escritorio, o buscalo en el menú Inicio.

### Desinstalar el programa
- Andá a **Configuración de Windows → Aplicaciones → Aplicaciones instaladas**, buscá "Ushuaia CRM" y hacé clic en **"Desinstalar"**.

---

## 🖥️ Pantalla principal

El programa tiene un **menú a la izquierda** (barra lateral) con las secciones principales:

| Sección | ¿Para qué sirve? |
|---------|-------------------|
| 📊 **Dashboard** | Vista general del negocio: KPIs, entregas, calendario, gráfico de ingresos, top clientes y producción |
| 🔔 **Alertas** | Centro de alertas: pedidos vencidos, entregas del día, stock bajo, producción activa |
| 👥 **Clientes** | Agregar, editar y consultar tu lista de clientes con historial de pedidos |
| 🏭 **Producción** | Registrar órdenes de producción y su estado (planificado, en progreso, completado) |
| 📦 **Stock** | Control de inventario de productos terminados con precios y márgenes |
| 🧈 **Materia Prima** | Gestión de insumos y materias primas |
| ⚙️ **Configuración** | Personalizar el programa: datos de la empresa, logo, precios, entregas, categorías, respaldos |

---

## 📊 Dashboard

Es la pantalla de inicio. Muestra de un vistazo:

- **Tarjetas KPI** — Clientes, Ingresos del mes (con tendencia ↑↓ vs. mes anterior), Ganancia estimada, Entregas pendientes, Alertas de stock y Producción activa. Cada tarjeta es clickeable y te lleva a la sección correspondiente.
- **Entregas (7 días)** — Lista de entregas próximas con botón para abrir la ruta en Google Maps.
- **Calendario** — Mini calendario interactivo que marca los días con entregas. Hacé clic en un día para ver los detalles.
- **Top Clientes** — Ranking de los 5 mejores clientes por facturación. Hacé clic en el título para ir a Clientes.
- **Producción** — Resumen rápido: órdenes en progreso, planificadas, completadas y unidades totales.
- **Gráfico de Ingresos y Ganancia** — Barras duales (ingresos + ganancia). Configurable: elegí el mes de inicio y la cantidad de meses (3, 6, 9 o 12).
- **Alertas de Reposición** — Productos e insumos con stock bajo, al lado del gráfico.

### Navegación rápida desde el Dashboard
Hacé clic en cualquier tarjeta KPI o título de sección para ir directamente a la página correspondiente (Clientes, Alertas, Producción, etc.). El cursor cambia a una mano para indicar que es clickeable.

### Abrir ruta en el mapa
En la sección "Próximas Entregas" podés hacer clic en **"🗺️ Abrir ruta"** para abrir Google Maps con todas las direcciones de entrega como paradas. También podés hacer clic en **📍** en cada entrega individual para ver la ubicación exacta del cliente.

### Eliminar datos de ejemplo
Cuando el programa se instala por primera vez, viene con **datos de demostración** (clientes, productos, insumos y órdenes de producción de ejemplo). En el Dashboard aparece un banner informativo con el botón **"🗑️ Eliminar datos de ejemplo"**. Al hacer clic, se eliminan únicamente los datos de demostración; los datos que hayas agregado vos se conservan. Una vez eliminados, el banner desaparece automáticamente.

---

## � Alertas

Centro de alertas unificado. Muestra todas las situaciones que requieren tu atención:

- **Pedidos vencidos** — Entregas cuya fecha ya pasó y no se marcaron como completadas.
- **Entregas de hoy** — Pedidos que deben entregarse hoy.
- **Stock bajo de productos** — Productos con stock por debajo del mínimo.
- **Stock bajo de materia prima** — Insumos que necesitan reposición.
- **Próximas entregas** — Entregas programadas para los próximos 7 días.
- **Producción activa** — Órdenes en progreso.
- **Producción planificada** — Órdenes pendientes de iniciar.

Cada sección se puede **colapsar/expandir** haciendo clic en su encabezado (aparece un ▾ que rota al colapsar).

---

## �👥 Clientes

### Agregar un cliente
1. Hacé clic en **"+ Nuevo Cliente"**
2. Completá los campos: nombre, contacto, email, teléfono, dirección y categoría
3. Hacé clic en **"Guardar"**

### Ver detalles de un cliente
- Hacé clic en el **nombre del cliente** para ver su información completa y el historial de pedidos.

### Registrar un pedido
1. Dentro de la ficha del cliente, hacé clic en **"+ Agregar pedido"**.
2. Se abre un formulario inline con los campos:
   - **Producto**: seleccioná de la lista de productos existentes
   - **Cantidad (cajas/bandejas)**: ingresá cuántas unidades
   - **Total ($)**: se calcula automáticamente según el precio del producto × cantidad (podés editarlo manualmente)
   - **Fecha de entrega**: opcional, para agendar cuándo entregar el pedido
3. Hacé clic en **"Confirmar pedido"**.

### Marcar entrega como completada
- En el historial de pedidos del cliente, los pedidos con fecha de entrega muestran un badge de estado (📦 Pendiente o ✅ Entregado). Hacé clic en el badge para cambiar el estado.

### Ver cliente en el mapa
- En la ficha del cliente, debajo de la dirección aparece el botón **"📍 Ver en mapa"**. Abre la ubicación en Google Maps.

### Exportar a Excel
- Hacé clic en **"📄 Exportar CSV"** para descargar la lista de clientes. Ese archivo lo podés abrir directamente con Excel o cualquier planilla de cálculo.

---

## 🏭 Producción

### Crear una orden de producción
1. Hacé clic en **"+ Nueva Orden"**
2. Seleccioná el producto, cantidad, fecha y estado
3. Hacé clic en **"Guardar"**

### Estados disponibles
- **Planificado** — La orden está programada
- **En progreso** — Se está fabricando
- **Completado** — Terminó la producción
- **Cancelado** — Se canceló la orden

Podés editar o eliminar cualquier orden desde la tabla.

---

## 📦 Stock de Productos

Acá controlás el inventario de tus productos terminados (alfajores).

- **Agregar producto**: clic en "+ Nuevo Producto", completá nombre, descripción, categoría, stock actual, stock mínimo y precios.
- **Precios**: cada producto tiene precio minorista, precio mayorista y costo de producción. El margen de ganancia se calcula automáticamente.
- **Ajustar stock rápido**: en productos con stock bajo aparece un botón para sumar unidades directamente.
- **Alerta automática**: cuando un producto tiene menos unidades que el stock mínimo, se muestra una alerta.

---

## 🧈 Materia Prima

Gestión de insumos (harina, dulce de leche, chocolate, etc.).

- **Agregar insumo**: clic en "+ Nuevo Insumo".
- **Alerta de reposición**: cuando un insumo cae por debajo del mínimo, se muestra el proveedor para que sepas a quién contactar.
- **Ajustar stock**: se puede sumar o restar cantidad directamente desde la tabla.

---

## 📄 Exportar CSV

En cada sección (Clientes, Stock, Materia Prima, Producción) vas a ver un botón **"📄 Exportar CSV"**.

- **¿Qué es un CSV?** Es un archivo de datos que se abre con **Excel**, Google Sheets o cualquier planilla de cálculo.
- **¿Para qué sirve?** Para tener una copia de tus datos en una planilla, hacer análisis, compartirlo con alguien o simplemente como respaldo de esa sección.
- Al hacer clic, se abre un cuadro de diálogo para elegir dónde guardar el archivo.

---

## ⚙️ Configuración

### Datos de la Empresa
Podés editar:
- Nombre de la empresa
- Teléfono
- Email
- Dirección

El nombre que pongas acá se muestra en la barra lateral y en el Dashboard.

### Logo de la Empresa
- Hacé clic en **"📁 Subir logo"** y seleccioná una imagen (PNG o JPG, máximo 512 KB).
- El logo reemplaza al emoji 🏔️ en la barra lateral.
- Si querés volver al emoji, hacé clic en **"🗑️ Quitar logo"**.

### Precios y Moneda
Podés configurar:
- **Moneda** (símbolo que se muestra, ej: $, US$)
- **Tipo de precio por defecto** para nuevos pedidos (minorista o mayorista)
- **Tasa de impuesto** (IVA, se muestra como referencia)
- Vista general de precios de todos los productos

### Entregas
- **Días por defecto para entrega** — Se usa como sugerencia al crear pedidos
- **Alertas de stock habilitadas** — Activar/desactivar las alertas de stock bajo

### Categorías personalizables
Podés agregar o quitar:
- **Categorías de clientes** (ej: distribuidor, minorista, gastronomía)
- **Categorías de productos** (ej: chocolate, maicena, premium)
- **Estados de producción** (ej: planificado, en-progreso, completado)
- **Unidades de medida** (ej: kg, litros, unidades)

Para agregar una categoría, escribila y hacé clic en **"Agregar"** (o presioná Enter).
Para eliminar, hacé clic en la **×** al lado del nombre.

### Respaldo y Restauración

- **📥 Guardar Respaldo**: Exporta TODOS los datos del programa (clientes, productos, insumos, producción y configuración) en un solo archivo. Guardalo en un lugar seguro.
- **📤 Restaurar Respaldo**: Si necesitás recuperar tus datos (por ejemplo, en otra computadora o después de reinstalar), hacé clic acá y seleccioná el archivo de respaldo que guardaste.

> **Consejo**: Guardá un respaldo periódicamente (por ejemplo, una vez por semana) para no perder información importante.

---

## 💡 Consejos útiles

1. **Eliminá los datos de ejemplo** — Si es tu primera vez, eliminá los datos de demostración desde el Dashboard para empezar con información real.
2. **Respaldá tus datos seguido** — Desde Configuración → Guardar Respaldo.
3. **Usá las categorías** — Ayudan a filtrar y organizar la información.
4. **Revisá el Dashboard** — Las alertas de stock te avisan cuándo reponer. El calendario de entregas muestra los días con entregas programadas.
5. **Registrá los pedidos con fecha de entrega** — Así aparecen en el calendario del Dashboard y podés planificar las entregas de la semana.
6. **Usá el mapa** — Desde el Dashboard o la ficha de un cliente podés abrir Google Maps para planificar las rutas de entrega.
7. **Exportá a CSV** antes de hacer cambios grandes — Te sirve como respaldo rápido de cada sección.
8. **Personalizá el programa** — Subí tu logo y ajustá los datos de la empresa desde Configuración.

---

## ❓ Preguntas frecuentes

**¿Dónde se guardan mis datos?**
Los datos se guardan localmente en tu computadora (en el almacenamiento del navegador interno del programa). No se envía nada a internet.

**¿Puedo usar el programa en otra computadora?**
Sí. Guardá un respaldo desde Configuración, copiá la carpeta del programa a la otra computadora y restaurá el respaldo.

**¿Puedo tener el programa abierto y cerrar Windows?**
Sí, al cerrar y volver a abrir el programa tus datos seguirán ahí.

**¿Necesito internet para usar el programa?**
No. El programa funciona completamente sin conexión a internet.

---

*Ushuaia CRM v1.1.0 — Hecho para la gestión de alfajores artesanales 🏔️*
