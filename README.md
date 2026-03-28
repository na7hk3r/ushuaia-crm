# 🏔️ Ushuaia CRM

**Sistema de gestión integral para Ushuaia Alfajores** — Software de escritorio para administrar clientes, producción, inventario y materia prima de un negocio de alfajores artesanales.

![Electron](https://img.shields.io/badge/Electron-41-47848F?logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Platform](https://img.shields.io/badge/Plataforma-Windows-0078D4?logo=windows&logoColor=white)

---

## ✨ Características

- **Dashboard** — Vista general con KPIs clickeables, calendario de entregas, gráfico dual de ingresos y ganancia, ranking de top clientes y resumen de producción. Navegación rápida a cada sección al hacer clic.
- **Alertas** — Centro unificado de alertas: pedidos vencidos, entregas del día, stock bajo, producción activa. Secciones colapsables.
- **Calendario de entregas** — Mini calendario interactivo que marca las fechas de entrega pendientes.
- **Gestión de Clientes** — Alta, edición, formulario inline de pedidos con producto/cantidad/fecha de entrega. Tipo de precio (minorista/mayorista) y resumen de ganancia.
- **Mapa** — Botón para abrir la ubicación y ruta de entregas en Google Maps.
- **Producción** — Órdenes de producción con estados (planificado, en progreso, completado).
- **Stock de Productos** — Inventario con precios (minorista, mayorista, costo), cálculo de margen y alertas de stock bajo.
- **Materia Prima** — Control de insumos con stock mínimo y datos de proveedores.
- **Exportar CSV** — Descarga los datos de cada sección en formato Excel/CSV.
- **Respaldo y Restauración** — Exportar e importar todos los datos en un solo archivo.
- **Configuración personalizable** — Nombre de empresa, logo, moneda, tipo de precio, tasa de impuesto, categorías, unidades de medida, opciones de entrega.
- **Guía de uso integrada** — Documentación completa accesible desde Configuración, con búsqueda y renderizado de Markdown.
- **Actualizaciones automáticas** — El programa detecta nuevas versiones y permite descargarlas e instalarlas desde la propia app.
- **Datos de ejemplo eliminables** — El programa incluye datos de demostración que se pueden eliminar con un solo clic desde el Dashboard.
- **100% offline** — No requiere conexión a internet. Los datos se guardan localmente.

---

## 🖥️ Capturas

| Dashboard | Clientes | Configuración |
|:---------:|:--------:|:-------------:|
| Vista general con KPIs y gráficos | Lista, ficha y pedidos | Logo, categorías, respaldo |

---

## 🚀 Instalación (usuario final)

1. Descargá el archivo **UshuaiaCRM-Setup-x.x.x.exe** desde [Releases](https://github.com/na7hk3r/ushuaia-crm/releases).
2. Ejecutá el instalador y seguí los pasos del asistente.
3. Abrí **Ushuaia CRM** desde el acceso directo en el escritorio.
4. Las actualizaciones futuras se descargan automáticamente desde la app.

> Consultá la [Guía de Uso](GUIA-DE-USO.md) para instrucciones detalladas.

---

## 🛠️ Desarrollo

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)

### Instalación

```bash
git clone https://github.com/tu-usuario/ushuaia-crm.git
cd ushuaia-crm
npm install
```

### Modo desarrollo

```bash
npm run dev
```

Abre la app en Electron con hot-reload de Vite.

### Compilar el ejecutable (.exe)

```bash
npm run electron:build
```

El instalador y el portable se generan en la carpeta `release/`.

---

## 📁 Estructura del proyecto

```
├── electron/           # Proceso principal de Electron
│   ├── main.js         # Ventana principal
│   ├── preload.js      # Bridge seguro (contextBridge)
│   ├── updater.js      # Auto-updater (electron-updater)
│   └── ipc/            # Handlers IPC separados
│       ├── appHandlers.js
│       └── fileHandlers.js
├── src/
│   ├── components/     # Componentes React
│   │   ├── Alerts.jsx
│   │   ├── Clients.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Materials.jsx
│   │   ├── Production.jsx
│   │   ├── Settings.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Stock.jsx
│   │   ├── UpdateBanner.jsx
│   │   └── UsageGuide.jsx
│   ├── data/           # Datos iniciales y constantes
│   ├── hooks/          # Custom hooks (useLocalStorage)
│   ├── utils/          # Utilidades (exportCSV, respaldo)
│   ├── App.jsx         # Componente raíz
│   ├── App.css         # Estilos principales
│   └── index.css       # Variables CSS (paleta patagónica)
├── .github/workflows/  # CI/CD con GitHub Actions
│   └── release.yml     # Build + publish automático con tags
├── index.html          # Entry point
├── vite.config.js      # Configuración Vite + Electron
├── package.json        # Dependencias y scripts
└── GUIA-DE-USO.md      # Documentación para el usuario final
```

---

## 🎨 Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| **React 19** | Interfaz de usuario |
| **Vite 8** | Bundler y dev server |
| **Electron 41** | Aplicación de escritorio |
| **Recharts** | Gráficos del Dashboard |
| **electron-builder** | Empaquetado .exe |
| **electron-updater** | Actualizaciones automáticas (OTA) |
| **GitHub Actions** | CI/CD: build + release automático |
| **localStorage** | Persistencia de datos |

---

## � Releases y actualizaciones

El proyecto usa **GitHub Actions** para generar releases automáticos. Para publicar una nueva versión:

```bash
npm version patch   # o minor / major
git push origin main --follow-tags
```

Esto dispara el workflow que compila el instalador NSIS + portable y los publica como GitHub Release. Los usuarios existentes reciben una notificación de actualización dentro de la app.

---

## 📄 Licencia

Proyecto privado — Ushuaia Alfajores © 2026
