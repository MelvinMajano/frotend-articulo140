# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# 📚 Sistema de Gestión de Actividades - Artículo 140 UNAH

## 🌟 Descripción del Proyecto

Sistema web para la gestión de actividades estudiantiles bajo el **Artículo 140** de la Universidad Nacional Autónoma de Honduras (UNAH). Este sistema permite a estudiantes inscribirse en actividades, a supervisores gestionar la asistencia, y a administradores supervisar todo el proceso.

## 🏗️ Arquitectura del Sistema

### **Frontend Stack**
- **React 19** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Navegación SPA
- **TailwindCSS** - Styling framework
- **Shadcn/UI** - Componentes UI
- **Zustand** - State management
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Date-fns** - Manipulación de fechas

## 👥 Roles del Sistema

### 🔧 **Administrador**
- Gestión completa de actividades
- Administración de usuarios (estudiantes/supervisores)
- Gestión de carreras académicas
- Visualización de reportes y estadísticas
- Acceso a actividades eliminadas

### 👨‍🏫 **Supervisor**
- Gestión de asistencia a actividades
- Control de inscripciones
- Seguimiento de estudiantes asignados

### 🎓 **Estudiante**
- Inscripción a actividades disponibles
- Visualización de actividades inscritas
- Seguimiento de progreso personal

## 🚀 Instalación y Configuración

### **Prerrequisitos**
```bash
# Node.js (versión 18 o superior)
node --version

# npm o yarn
npm --version
```

### **1. Clonar el Repositorio**
```bash
git clone <repository-url>
cd frontend-articulo140
```

### **2. Instalar Dependencias**
```bash
npm install
# o
yarn install
```

### **3. Configuración de Variables de Entorno**
```bash
# Copiar el archivo de template
cp .env.template .env

# Editar el archivo .env con las configuraciones necesarias
```

**Variables requeridas en `.env`:**
- `VITE_API_URL`: URL del backend API
- Otras variables según el entorno de despliegue

### **4. Ejecutar el Proyecto**

#### **Modo Desarrollo**
```bash
npm run dev
# o
yarn dev
```
El proyecto estará disponible en: `http://localhost:5173`

#### **Modo Producción**
```bash
# Build
npm run build
# o
yarn build

# Preview del build
npm run preview
# o
yarn preview
```

## 📁 Estructura del Proyecto

```
src/
├── articulo-140/                    # Módulo principal de la aplicación
│   ├── admin/                       # Módulos de administración
│   │   ├── components/              # Componentes específicos de admin
│   │   └── pages/                   # Páginas de administración
│   ├── auth/                        # Sistema de autenticación
│   │   ├── actions/                 # Actions de autenticación
│   │   ├── pages/                   # Login, Register
│   │   └── store/                   # Store de Zustand para auth
│   ├── home/                        # Páginas principales
│   │   ├── aboutPage/               # Página de información
│   │   └── activitiesPage/          # Gestión de actividades
│   ├── supervisor/                  # Módulos de supervisor
│   ├── layout/                      # Layouts de la aplicación
│   ├── api/                         # Configuración de API
│   └── articuloAppRouter/           # Configuración de rutas
├── components/                      # Componentes reutilizables
│   ├── ui/                          # Componentes de Shadcn/UI
│   └── custom/                      # Componentes personalizados
├── hooks/                           # Custom hooks
└── lib/                             # Utilidades y helpers
```

## 🔐 Sistema de Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para la autenticación:

### **Flujo de Autenticación**
1. **Login**: Credenciales → Token JWT
2. **Almacenamiento**: LocalStorage
3. **Interceptor**: Axios añade automáticamente el token
4. **Verificación**: Check de estado cada 30 segundos
5. **Protección**: Rutas protegidas por roles

### **Rutas Protegidas**
- `AuthenticatedRoute`: Requiere estar logueado
- `AdminRoute`: Solo administradores
- `SupervisorRoute`: Solo supervisores
- `NotAuthenticatedRoute`: Solo usuarios no logueados

## 🎨 Sistema de Componentes

### **Componentes UI (Shadcn/UI)**
- `Button`, `Input`, `Card`, `Dialog`
- `Calendar`, `Popover`, `Select`
- `Tabs`, `Switch`, `Checkbox`

### **Componentes Personalizados**
- `DateTimePicker`: Selector de fecha y hora
- `CustomNavBar`: Navegación principal
- `CustomMainCard`: Cards de actividades
- `CustomPagination`: Paginación

## 📊 Gestión de Estado

### **Estado Global (Zustand)**
```typescript
// Auth Store
- user: User | null
- token: string | null  
- state: 'authenticated' | 'no-authenticated' | 'checking'
- isAdmin(), isStudent(), isSupervisor()
- login(), logout(), register()
```

### **Estado del Servidor (TanStack Query)**
- Cache automático de datos
- Revalidación en background
- Manejo de loading/error states
- Optimistic updates

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo

# Build
npm run build            # Compilar para producción  
npm run preview          # Preview del build

# Code Quality
npm run lint             # Linter ESLint
```

## 🌐 Configuración de API

### **Base URL**
El proyecto se conecta a una API REST configurada en las variables de entorno (`.env`).

### **Interceptores Axios**
- **Request**: Añade automáticamente JWT token
- **Response**: Manejo global de errores

## 📱 Características Principales

### **🎯 Para Estudiantes**
- **Dashboard de Actividades**: Visualización de actividades disponibles
- **Sistema de Inscripción**: Inscripción simple a actividades
- **Seguimiento Personal**: Progreso y historial

### **👨‍🏫 Para Supervisores**
- **Gestión de Asistencia**: Control de asistencia con DateTimePicker
- **Lista de Inscritos**: Visualización de estudiantes por actividad
- **Modificación de Registros**: Actualización de horarios de entrada

### **🔧 Para Administradores**
- **CRUD de Actividades**: Crear, editar, eliminar actividades
- **Gestión de Usuarios**: Administrar estudiantes y supervisores
- **Gestión de Carreras**: Administrar carreras académicas
- **Panel de Control**: Estadísticas y reportes
- **Papelera**: Recuperación de actividades eliminadas

## 🎨 Diseño y UX

### **Sistema de Colores**
- **Primary**: Azul institucional
- **Secondary**: Colores complementarios
- **Success/Warning/Error**: Estados del sistema

### **Responsive Design**
- **Mobile First**: Diseño adaptativo
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Componentes Flexibles**: Grid y Flexbox

### **Dark Mode**
- Soporte para tema oscuro/claro
- Persistencia de preferencias
- Transiciones suaves

## 🔧 Configuraciones Avanzadas

### **TypeScript**
```json
// tsconfig.json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

### **TailwindCSS**
- Configuración personalizada
- Componentes reutilizables
- Utilidades custom

### **Vite**
- Alias de rutas (@/...)
- Plugins optimizados
- Hot Module Replacement

## 📋 Dependencias Principales

### **Producción**
- `react` + `react-dom`: Framework base
- `react-router`: Navegación
- `@tanstack/react-query`: Server state
- `zustand`: Client state
- `axios`: HTTP client
- `tailwindcss`: Styling
- `date-fns`: Manipulación de fechas
- `lucide-react`: Iconos

### **Desarrollo**
- `typescript`: Tipado estático
- `vite`: Build tool
- `eslint`: Code linting
- `@types/*`: Tipos de TypeScript

## 🚨 Solución de Problemas

### **Errores Comunes**

1. **Error de conexión API**
   ```bash
   # Verificar que el backend esté corriendo
   # Revisar la variable VITE_API_URL en .env
   ```

2. **Problemas de autenticación**
   ```bash
   # Limpiar localStorage
   localStorage.clear()
   ```

3. **Errores de build**
   ```bash
   # Limpiar node_modules
   rm -rf node_modules
   npm install
   ```

## 📈 Características Técnicas

### **Performance**
- **Code Splitting**: Lazy loading de rutas
- **Tree Shaking**: Eliminación de código no usado
- **Bundle Optimization**: Chunks optimizados

### **SEO y Accesibilidad**
- **Meta Tags**: Configurados dinámicamente
- **ARIA Labels**: Accesibilidad completa
- **Keyboard Navigation**: Navegación por teclado

### **Seguridad**
- **JWT Tokens**: Autenticación segura
- **Route Guards**: Protección de rutas
- **XSS Protection**: Sanitización de inputs

## 🤝 Contribución

### **Flujo de Desarrollo**
1. Fork del repositorio
2. Crear branch feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### **Estándares de Código**
- **ESLint**: Configuración estricta
- **Prettier**: Formateo automático
- **Conventional Commits**: Mensajes de commit
- **TypeScript**: Tipado estricto

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto:
- **Email**: soporte@articulo140.unah.edu.hn
- **Issues**: GitHub Issues
- **Documentación**: Wiki del repositorio

---

**Desarrollado con ❤️ para la Universidad Nacional Autónoma de Honduras (UNAH)**

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
