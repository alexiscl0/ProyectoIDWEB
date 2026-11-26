# Educación y Cultura

Directorio web de instituciones educativas y culturales. El proyecto reúne
academias e institutos, bibliotecas, colegios, guarderías y nidos, e institutos
de idiomas en una interfaz común.

> **Avance actual:** primera fase de interfaz con HTML semántico, CSS propio y
> JavaScript. No usa Bootstrap. El catálogo de demostración se guarda localmente
> en el navegador; aún no está conectado a un servidor ni a una base de datos.

## Ejecutar

Desde la carpeta del proyecto:

```bash
cd frontend
python3 -m http.server 5173
```

Abre <http://localhost:5173>. Para entrar usa una cuenta de demostración:

| Perfil | Correo | Contraseña |
|---|---|---|
| Administración | `admin@educulturademo.test` | `Admin123!` |
| Gestión educativa | `gestor@educulturademo.test` | `Gestor123!` |

## Funcionalidad de esta fase

- Acceso de demostración y cierre de sesión.
- Panel con métricas y distribución por área.
- Directorio de instituciones con búsqueda, filtro, alta, edición y eliminación.
- Validación de campos y persistencia temporal con `localStorage`.
- Diseño responsive construido con CSS propio.

## Áreas del directorio

1. Academias e institutos
2. Bibliotecas
3. Colegios
4. Guarderías y Nidos
5. Idiomas

## Estructura

```text
frontend/
├── login.html
├── index.html
├── instituciones.html
├── css/
│   └── estilos.css
└── js/
    ├── datos.js
    ├── auth.js
    ├── ui.js
    ├── login.js
    ├── dashboard.js
    └── instituciones.js
```

## Nota de seguridad

Las credenciales y la sesión de demostración se manejan en el navegador solo
para permitir probar esta primera fase. No es autenticación segura. En una fase
posterior el acceso debe validarse en el backend y las contraseñas deben
almacenarse con hash; los datos deben migrarse de `localStorage` a una API.
