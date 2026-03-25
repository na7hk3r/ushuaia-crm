# 🏔️ Ushuaia CRM

**Sistema de gestión integral para Ushuaia Alfajores** — Software de escritorio para administrar clientes, producción, inventario y materia prima de un negocio de alfajores artesanales.

![Electron](https://img.shields.io/badge/Electron-41-47848F?logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Platform](https://img.shields.io/badge/Plataforma-Windows-0078D4?logo=windows&logoColor=white)

---

## ✨ Características

- **Dashboard** — Vista general con KPIs, gráficos de stock, facturación por cliente y alertas.
- **Gestión de Clientes** — Alta, edición, historial de pedidos y ficha detallada por cliente.
- **Producción** — Órdenes de producción con estados (planificado, en progreso, completado).
- **Stock de Productos** — Inventario con alertas automáticas de stock bajo.
- **Materia Prima** — Control de insumos con stock mínimo y datos de proveedores.
- **Exportar CSV** — Descarga los datos de cada sección en formato Excel/CSV.
- **Respaldo y Restauración** — Exportar e importar todos los datos en un solo archivo.
- **Configuración personalizable** — Nombre de empresa, logo, categorías, unidades de medida.
- **100% offline** — No requiere conexión a internet. Los datos se guardan localmente.

---

## 🖥️ Capturas

| Dashboard | Clientes | Configuración |
|:---------:|:--------:|:-------------:|
| Vista general con KPIs y gráficos | Lista, ficha y pedidos | Logo, categorías, respaldo |

---

## 🚀 Instalación (usuario final)

1. Descargá el archivo **Ushuaia CRM Setup 1.0.0.exe** desde [Releases](#).
2. Ejecutá el instalador y seguí los pasos del asistente.
3. Abrí **Ushuaia CRM** desde el acceso directo en el escritorio.

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
│   ├── main.js         # Ventana principal, IPC handlers
│   └── preload.js      # Bridge seguro (contextBridge)
├── src/
│   ├── components/     # Componentes React
│   │   ├── Clients.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Materials.jsx
│   │   ├── Production.jsx
│   │   ├── Settings.jsx
│   │   ├── Sidebar.jsx
│   │   └── Stock.jsx
│   ├── data/           # Datos iniciales y constantes
│   ├── hooks/          # Custom hooks (useLocalStorage)
│   ├── utils/          # Utilidades (exportCSV, respaldo)
│   ├── App.jsx         # Componente raíz
│   ├── App.css         # Estilos principales
│   └── index.css       # Variables CSS (paleta patagónica)
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
| **localStorage** | Persistencia de datos |

---

## 📄 Licencia

Proyecto privado — Ushuaia Alfajores © 2026
