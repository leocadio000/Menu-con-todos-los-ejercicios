# Proyecto Integrador - Laboratorio de Programación III (UASD)

Aplicación web que integra en un solo menú dinámico todos los ejercicios ("prácticas")
solicitados en el curso, con login, formulario multipágina persistido en base de datos,
y estructura lista para desplegar en la web y subir a GitHub.

## Cumplimiento de los requisitos del enunciado

1. **Login con usuario y contraseña** → `server.js` (`/api/login`, `/api/logout`,
   `/api/check-auth`) + `public/login.html`. Las contraseñas se guardan con hash
   `bcrypt`, nunca en texto plano.
2. **Formulario multipágina que guarda en base de datos** → Práctica 7 en
   `public/js/main.js` + endpoint `POST /api/registro-multipaso` en `server.js`,
   que inserta en la tabla `registros_formulario`.
3. **Menú dinámico** → `GET /api/menu` devuelve la estructura en JSON y
   `public/js/main.js` la consume para construir los botones del menú.
4. **Todo montado en la web** → instrucciones de despliegue gratuito más abajo
   (Render). Al terminar, debes enviar la URL pública y las credenciales.
5. **Lenguaje de programación libre** → Node.js + Express para la API y la
   capa de aplicación.
6. **Uso de IA como apoyo** → este proyecto fue generado y adaptado con
   asistencia de IA (Gemini para la versión inicial y Claude para adaptarlo a
   SQLite, reforzar el login con bcrypt y documentar el despliegue).
7. **Repositorio en GitHub** → pasos de publicación más abajo.

## Estructura del proyecto

```
proyecto-lab-prog3/
├── package.json
├── server.js
├── database.sql        (documentación del esquema; se crea solo al arrancar)
├── .env.example
├── .gitignore
└── public/
    ├── index.html       (dashboard + menú dinámico)
    ├── login.html
    ├── css/style.css
    └── js/main.js
```

La base de datos es **SQLite**, usando el módulo `node:sqlite` **incluido en
Node.js** (disponible desde Node 22.5, estable desde Node 24 — no requiere
instalar `better-sqlite3` ni ningún otro paquete nativo, así que no hace
falta tener Python ni Visual Studio Build Tools instalados). El archivo
`lab_prog3.db` se crea automáticamente la primera vez que arranca el
servidor.

**Requisito:** Node.js 22.5 o superior (`node -v` para comprobarlo).

## 1. Ejecutar en local

```bash
npm install
npm start
```

Si tu Node es 22.x verás una advertencia en consola
(`ExperimentalWarning: SQLite is an experimental feature`) — es solo un aviso,
no impide que funcione. En Node 24 no aparece.

Abre `http://localhost:3000` en el navegador. Te redirigirá a `login.html`.

**Credenciales de prueba:** usuario `admin`, contraseña `admin123`
(se crean automáticamente la primera vez que arranca el servidor).

## 2. Subir el proyecto a GitHub

```bash
cd proyecto-lab-prog3
git init
git add .
git commit -m "Proyecto integrador - Lab Programación III"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/proyecto-lab-prog3.git
git push -u origin main
```

Reemplaza `TU-USUARIO` por tu usuario de GitHub y crea antes el repositorio
vacío desde github.com/new (sin README, sin .gitignore, para no chocar con
los que ya incluye este proyecto).

El enlace que debes entregar es:
`https://github.com/TU-USUARIO/proyecto-lab-prog3`

## 3. Desplegar en la web (Render, gratis)

Render puede desplegar directo desde GitHub y persiste el archivo SQLite en
un disco si usas su plan gratuito con "disco persistente"; si no, cada
redeploy reinicia los datos (para un proyecto académico normalmente es
suficiente).

1. Crea una cuenta en https://render.com y conéctala a tu GitHub.
2. "New +" → "Web Service" → selecciona el repositorio `proyecto-lab-prog3`.
3. Configuración:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variable:** `SESSION_SECRET` = un valor secreto cualquiera
4. Deploy. Render te da una URL pública tipo
   `https://proyecto-lab-prog3.onrender.com`.
5. Esa URL, junto con el usuario `admin` / contraseña `admin123`
   (o las que tú cambies), es lo que debes enviar al profesor.

Alternativas equivalentes: Railway, Fly.io o Cyclic, con pasos muy similares.

## 4. Cambiar a MySQL (opcional)

El enunciado permite cualquier motor. Si prefieres MySQL/MariaDB en vez de
SQLite:

1. `npm install mysql2`.
2. Usa el esquema comentado al final de `database.sql`.
3. Reemplaza el bloque de conexión en `server.js` por un pool de `mysql2`, y
   cambia las consultas `db.prepare(...).get/run/all` por `pool.query(...)`.
4. En Render, agrega un servicio de MySQL gestionado (o usa uno externo como
   PlanetScale / Railway MySQL) y pásale la cadena de conexión como variable
   de entorno.

## Notas de seguridad

- Cambia `SESSION_SECRET` y la contraseña del usuario `admin` antes de
  entregar el proyecto en producción.
- Las contraseñas se almacenan con `bcrypt`, no en texto plano.
