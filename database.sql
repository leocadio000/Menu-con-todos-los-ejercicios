-- Este esquema se crea automáticamente al iniciar server.js (ver bloque db.exec).
-- Se incluye aquí como referencia y documentación de la base de datos SQLite.

CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,          -- almacenada con hash bcrypt, nunca en texto plano
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Usuario por defecto: admin / admin123 (se crea automáticamente la primera vez que arranca el servidor)

CREATE TABLE IF NOT EXISTS registros_formulario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    cedula TEXT UNIQUE NOT NULL,
    correo TEXT NOT NULL,
    telefono TEXT,
    direccion TEXT,
    profesion TEXT,
    nivel_estudios TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ¿Prefieres MySQL/MariaDB en vez de SQLite? Usa este equivalente:
--
-- CREATE TABLE usuarios (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(50) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
--
-- CREATE TABLE registros_formulario (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     nombre VARCHAR(100) NOT NULL,
--     apellido VARCHAR(100) NOT NULL,
--     cedula VARCHAR(20) UNIQUE NOT NULL,
--     correo VARCHAR(150) NOT NULL,
--     telefono VARCHAR(20),
--     direccion TEXT,
--     profesion VARCHAR(100),
--     nivel_estudios VARCHAR(50),
--     fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
--
-- Y en server.js cambiarías better-sqlite3 por el paquete "mysql2" (ver README.md,
-- sección "Cambiar a MySQL").
