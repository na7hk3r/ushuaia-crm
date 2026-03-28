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
│   ├── data/           # Datos iniciales y constantes
│   ├── hooks/          # Custom hooks (useLocalStorage)
│   ├── utils/          # Utilidades (exportCSV, respaldo)
│   ├── App.jsx         # Componente raíz
│   ├── App.css         # Estilos principales
│   └── index.css       # Variables CSS (paleta patagónica)
├── landing/            # Landing page (GitHub Pages)
│   ├── index.html      # Página principal con descarga y release notes
│   ├── style.css       # Estilos de la landing
│   ├── script.js       # Fetch dinámico de releases desde GitHub API
│   └── 404.html        # Página de error
├── scripts/
│   ├── release.js      # Script de versionado automático (npm run release)
│   └── generate-assets.js
├── .github/workflows/
│   └── release.yml     # CI/CD: build + release + deploy landing
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

El proyecto usa **Semantic Versioning** (`MAJOR.MINOR.PATCH`) y **Conventional Commits** para automatizar el versionado, las notas de release y el deploy.

### Convención de commits

Usá estos prefijos en los mensajes de commit para que el sistema detecte automáticamente el tipo de release:

| Prefijo | Tipo | Ejemplo |
|---------|------|---------|
| `feat:` | **Minor** (funcionalidad nueva) | `feat: agregar filtro de búsqueda en clientes` |
| `fix:` | **Patch** (corrección) | `fix: corregir cálculo de stock negativo` |
| `feat!:` o `BREAKING:` | **Major** (cambio incompatible) | `feat!: nuevo formato de datos de producción` |
| Cualquier otro | **Patch** | `docs: actualizar guía de uso` |

Otros prefijos comunes (todos son patch): `docs:`, `style:`, `refactor:`, `perf:`, `chore:`, `test:`.

### Publicar una nueva versión

```bash
npm run release
```

Este comando hace **todo automáticamente**:

1. Verifica que no haya cambios sin commitear
2. Analiza los commits desde el último tag
3. Detecta si es `patch`, `minor` o `major` según los prefijos
4. Muestra un resumen y ejecuta `npm version`
5. Pushea el commit y tag al remoto

Para forzar un tipo específico:

```bash
npm run release -- patch    # forzar patch
npm run release -- minor    # forzar minor
npm run release -- major    # forzar major
```

### ¿Qué pasa en GitHub Actions?

Al pushear un tag `v*`, el workflow hace automáticamente:

1. **Job `release`** (Windows) — Compila el `.exe` (NSIS + portable), lo publica como GitHub Release con notas auto-generadas desde los commits
2. **Job `deploy-landing`** (Ubuntu) — Genera `CHANGELOG.md` y despliega la [landing page](https://na7hk3r.github.io/ushuaia-crm/) a GitHub Pages
3. Los usuarios existentes reciben notificación de actualización dentro de la app

### Configuración inicial del repo (una sola vez)

Para que el flujo funcione correctamente, verificá estos ajustes en GitHub:

1. **Settings → Pages → Source** → seleccionar **"GitHub Actions"**
2. **Settings → Environments → github-pages → Deployment branches and tags** → seleccionar **"All branches and tags"** (necesario porque el workflow se dispara desde tags, no branches)

---

## 📄 Licencia

Proyecto privado — Ushuaia Alfajores © 2026
